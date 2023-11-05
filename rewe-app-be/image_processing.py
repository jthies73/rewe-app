import cv2
import numpy as np


def preprocess_image(image: np.array):
    """
    Preprocesses the input image to highlight the text
    :return: preprocessed image in numpy array
    """
    # Convert it to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply binary thresholding to create a black-on-white image
    _, highlighted_image = cv2.threshold(
        gray_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    return highlighted_image
