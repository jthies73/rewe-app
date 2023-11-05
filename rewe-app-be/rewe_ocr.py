"""
This module extracts the text from the images using easy OCR.
"""
from typing import List

import cv2
import easyocr
import numpy as np

from image_processing import preprocess_image


class ReweOcr:
    def __init__(
        self,
        image: np.array,
        confidence_threshold: float = 0.25,
    ) -> None:
        self.image: np.array = image
        self.img_width = self.image.shape[1]
        self.img_height = self.image.shape[0]
        self.one_letter_height: int = 0
        self.one_letter_width: int = 0
        self.conf_thres = confidence_threshold
        self.ocr_output: List = []
        self.prices = []
        self.items = []
        self.prices_indices = []

    def __get_one_letter_dims(self) -> None:
        """
        Finds the average height and width of one letter.
        """
        heights = []
        widths = []
        for txt in self.ocr_output:
            if len(txt[1]) == 1 and txt[1] != '"' and txt[1] != "'":
                widths.append(int(abs(txt[0][2][0] - txt[0][3][0])))
                heights.append(int(abs(txt[0][2][1] - txt[0][1][1])))

        self.one_letter_width = int(sum(widths) / len(widths))
        self.one_letter_height = int(sum(heights) / len(heights))

    def __remove_low_confidence_text(self):
        """
        Removes the retrieved text having confidence less than self.conf_thres
        """
        refined = []
        for i, txt in enumerate(self.ocr_output):
            if txt[2] > self.conf_thres:
                refined.append(txt)

        self.ocr_output = refined

    def __filter_items_of_bill(self) -> List:
        """
        Collects all the items info in a list
        """
        text = [x[1] for x in self.ocr_output]
        start_idx = text.index("EUR") + 1
        end_idx = text.index("SUMME") - 1

        self.ocr_items = self.ocr_output[start_idx : end_idx + 1]

    def __get_start_point_of_items(self):
        """
        Gets starting pixel x and y value for item
        """
        x = self.ocr_items[0][0][0][0]
        y = self.ocr_items[0][0][0][1]
        return x, y

    def __get_start_point_of_prices(self):
        """
        gets starting pixel x and y value for item
        """
        for txt in self.ocr_items:
            if txt[0][0][0] > self.img_width * 0.75:
                x = txt[0][0][0]
                y = txt[0][0][1]
                break
        else:
            raise RuntimeError("Could not find starting pixels of items")
        return x, y

    def __collect_items(self):
        """
        Collects all the items in a list
        """
        if len(self.prices_indices) == 0:
            raise ValueError("The prices indices is empty")
        self.items = []
        items = []
        item_start_x, item_start_y = self.__get_start_point_of_items()
        prices_start_x, prices_start_y = self.__get_start_point_of_prices()
        for idx, txt in enumerate(self.ocr_items):
            if idx not in self.prices_indices:
                items.append(txt)
        current_item = ""
        for idx, txt in enumerate(items):
            if (
                item_start_x - self.one_letter_width
                <= txt[0][0][0]
                <= item_start_x + self.one_letter_width
            ):
                if current_item != "":
                    self.items.append(current_item)
                    current_item = ""
                current_item += txt[1]
            elif (
                txt[0][0][0] >= item_start_x + self.one_letter_width
                and current_item != ""
            ):
                current_item += " " + txt[1]
            if idx == len(items) - 1:
                self.items.append(current_item)

    def __collect_prices(self):
        """
        Collects all the prices in a list
        """
        prices = []
        self.prices_indices = []
        for idx, txt in enumerate(self.ocr_items):
            if txt[0][0][0] > self.img_width * 0.75:
                prices.append(txt)
                self.prices_indices.append(idx)

        current_price = ""
        previous_txt_bbox = []
        for idx, txt in enumerate(prices):
            if idx == 0:
                current_price += txt[1]
                previous_txt_bbox = txt[0]
                continue
            if (
                previous_txt_bbox[0][1]
                <= txt[0][0][1]
                < previous_txt_bbox[0][1] + self.one_letter_height
            ):
                current_price += txt[1]
            else:
                self.prices.append(current_price)
                current_price = ""
                current_price += txt[1]
                previous_txt_bbox = txt[0]
            if idx == len(prices) - 1:
                self.prices.append(current_price)

    def __ocr_output_to_text(self):
        lines = [" ".join(tokens) for tokens in zip(self.items, self.prices)]
        return "\n".join(lines)

    def ocr(self) -> None:
        """
        This method takes the input image and extracts the text using easy ocr.
        :return: A list of strings extracted from the image.
        """
        reader = easyocr.Reader(["en", "de"], gpu=False)
        self.ocr_output = reader.readtext(self.image, paragraph=False)
        self.__remove_low_confidence_text()
        self.__get_one_letter_dims()
        self.__filter_items_of_bill()
        self.__collect_prices()
        self.__collect_items()
        return self.__ocr_output_to_text()


if __name__ == "__main__":
    txt_image = "data/ocr_images/IMG-20230903-WA0007_6_lowqual.jpg"
    image = cv2.imread(txt_image)
    preprocessed_image = preprocess_image(image)
    rewe_reader = ReweOcr(preprocessed_image)
    ocr = rewe_reader.ocr()
    print(ocr)
