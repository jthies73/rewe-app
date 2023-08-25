"""
This module extracts the text from the images
"""
import easyocr

txt_image = "decathlon_bill.jpg"

reader = easyocr.Reader(["en", "de"], gpu=True)
text_output = reader.readtext(txt_image, paragraph=True)

for text in text_output:
    print(text[1])
