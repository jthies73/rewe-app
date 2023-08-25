"""
This module extracts the text from the images
"""
import easyocr
import cv2
from matplotlib import pyplot as plt
import numpy as np

txt_image = "decathlon_bill.jpg"

reader = easyocr.Reader(["en"], gpu=True)
text_output = reader.readtext(txt_image, paragraph=True)

print(text_output)
