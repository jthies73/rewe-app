FROM python:3.11
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
COPY ./purchases.parquet /code/purchases.parquet
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./ /code/rewe-be
CMD ["uvicorn", "rewe-be.api:app", "--host", "0.0.0.0", "--port", "80"]
