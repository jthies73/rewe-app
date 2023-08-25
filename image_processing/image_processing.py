"""
This module extracts the text from the images
"""
import easyocr
import cv2
from matplotlib import pyplot as plt
import numpy as np

txt_image = "random.jpg"

reader = easyocr.Reader(["en"], gpu=True)
text_output = reader.readtext(txt_image)  # , paragraph=True)

print(text_output)
for text_data in text_output:
    print(text_data[1])
