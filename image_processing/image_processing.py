"""
This module extracts the text from the images using easy OCR.
"""
from typing import List

import cv2
import easyocr
import numpy as np


class ImageToText:
    """
    Class ImageToText
    """

    def __init__(self, image: str, img_preprocessing: bool, confidence_threshold: float = 0.25) -> None:
        self.image: np.array = cv2.imread(image)
        self.img_width = self.image.shape[1]
        self.img_height = self.image.shape[0]
        self.one_letter_height: int = 0
        self.one_letter_width: int = 0
        self.preprocess = img_preprocessing
        self.conf_thres = confidence_threshold
        self.ocr_output: List = []
        self.prices = []
        self.items = []
        self.prices_indices = []
        self.parse()
        self.get_one_letter_dims()
        self.get_prices()
        self.get_items()
        self.text_output: List[str] = []
        self.get_txt_only()

    def preprocessing(self) -> np.array:
        """
        Preprocesses the input image to highlight the text
        :return: preprocessed image in numpy array
        """
        # Convert it to grayscale
        gray_image = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)

        # Apply binary thresholding to create a black-on-white image
        _, highlighted_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        return highlighted_image

    def get_one_letter_dims(self) -> None:
        """
        Finds the average height and width of one letter with respect to this input bill.
        """
        heights = []
        widths = []
        for txt in self.ocr_output:
            if len(txt[1]) == 1 and txt[1] != '"' and txt[1] != "'":
                widths.append(int(abs(txt[0][2][0] - txt[0][3][0])))
                heights.append(int(abs(txt[0][2][1] - txt[0][1][1])))

        self.one_letter_width = int(sum(widths) / len(widths))
        self.one_letter_height = int(sum(heights) / len(heights))

    def refine_results(self):
        """
        Removes the retrieved text having confidence less than self.conf_thres
        """
        refined = []
        for i, txt in enumerate(self.ocr_output):
            if txt[2] > self.conf_thres:
                refined.append(txt)

        self.ocr_output = refined

    def get_txt_only(self) -> None:
        """
        Collects all the texts from the ocr output
        """
        for txt in self.ocr_output:
            self.text_output.append(txt[1])

    def get_total_sum(self):
        """
        gets the total sum of the bill.
        """
        pass

    def collect_items_info(self) -> List:
        """
        Collects all the items info in a list
        """
        start_idx = 0
        end_idx = 0
        for idx, txt in enumerate(self.ocr_output):
            if txt[1] == "EUR":
                start_idx = idx + 1
                break

        for idx, txt in enumerate(self.ocr_output):
            if txt[1] == "SUMME":
                end_idx = idx - 1
                break

        return self.ocr_output[start_idx:end_idx + 1]

    def get_start_point_of_items(self):
        """
        gets starting pixel x and y value for item
        """
        x = 0
        y = 0
        for txt in self.collect_items_info():
            x = txt[0][0][0]
            y = txt[0][0][1]
            break
        return x, y

    def get_start_point_of_prices(self):
        """
        gets starting pixel x and y value for item
        """
        x = 0
        y = 0
        for idx, txt in enumerate(self.collect_items_info()):
            if txt[0][0][0] > self.img_width * 0.75:
                x = txt[0][0][0]
                y = txt[0][0][1]
        return x, y

    def get_items(self):
        """
        Collects all the items in a list
        """
        if len(self.prices_indices) == 0:
            raise ValueError("The prices indices is empty")
        self.items = []
        items = []
        items_list = self.collect_items_info()
        item_start_x, item_start_y = self.get_start_point_of_items()
        prices_start_x, prices_start_y = self.get_start_point_of_prices()
        for idx, txt in enumerate(items_list):
            if idx not in self.prices_indices:
                items.append(txt)
        current_item = ""
        for idx, txt in enumerate(items):
            if item_start_x-self.one_letter_width <= txt[0][0][0] <= item_start_x + self.one_letter_width:
                if current_item != "":
                    self.items.append(current_item)
                    current_item = ""
                current_item += txt[1]
            elif txt[0][0][0] >= item_start_x + self.one_letter_width and current_item != "":
                current_item += " " + txt[1]
            if idx == len(items)-1:
                self.items.append(current_item)

    def get_prices(self):
        """
        Collects all the prices in a list
        """
        prices = []
        self.prices_indices = []
        for idx, txt in enumerate(self.collect_items_info()):
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
            if previous_txt_bbox[0][1] <= txt[0][0][1] < previous_txt_bbox[0][1]+self.one_letter_height:
                current_price += txt[1]
            else:
                self.prices.append(current_price)
                current_price = ""
                current_price += txt[1]
                previous_txt_bbox = txt[0]
            if idx == len(prices)-1:
                self.prices.append(current_price)

    def parse(self) -> None:
        """
        This method takes the input image and extracts the text using easy ocr.
        :return: A list of strings extracted from the image.
        """
        if self.preprocess:
            self.preprocessing()
        reader = easyocr.Reader(["en", "de"], gpu=True)
        self.ocr_output = reader.readtext(self.image, paragraph=False)
        self.refine_results()

    @staticmethod
    def save_image(image: np.array, path: str) -> None:
        """
        Saves the input image to the specified path.
        :param image: input image in numpy array.
        :param path: path and name of the image to be saved.
        """
        cv2.imwrite(path, image)


if __name__ == "__main__":
    txt_image = "test_images/IMG-20230903-WA0007_6_lowqual.jpg"
    img_to_txt = ImageToText(txt_image, img_preprocessing=False)
    print(img_to_txt.prices)
    print(img_to_txt.items)
