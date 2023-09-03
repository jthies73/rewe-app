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
        self.preprocess = img_preprocessing
        self.conf_thres = confidence_threshold
        self.ocr_output: List = []
        self.parse()
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
    txt_image = "test_images/IMG-20230903-WA0003.jpg"
    img_to_txt = ImageToText(txt_image, img_preprocessing=False)
    print(img_to_txt.ocr_output)
    print(img_to_txt.text_output)
