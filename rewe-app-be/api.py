import io

from typing import Union

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd

import db
import rewe_process

import json

import pandas as pd

app = FastAPI()
# Configure CORS (Cross-Origin Resource Sharing) settings
origins = [
    "http://localhost",  # Replace with your frontend domain(s)
    "http://localhost:8080",  # Add more origins as needed
    "http://localhost:8081",  # Add more origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

df = pd.read_parquet("purchases.parquet")


# Define an OPTIONS route for CORS preflight requests
@app.options("/api/")
async def options_route():
    return {"methods": "OPTIONS, GET, POST, PUT, DELETE"}
df = pd.read_parquet("purchases.parquet")


@app.get("/api/")
def read_root():
    return {"Hello": "World"}


@app.get("/api/mock/purchases")
async def read_purchases_mock(purchase_id: int | None = None):
    return df.to_json(orient="records")


@app.get("/api/mock/purchase/{purchase_id}")
async def read_purchase_mock(purchase_id: int):
    return df.loc[df.pid == purchase_id].to_json(orient="records")


@app.post("/api/images")
async def process_upload_image(file: UploadFile = File(...)):
    db.clean()
    db.create_database()
    contents = await file.read()
    await file.close()
    with io.BytesIO(contents) as fd:
        jsonString = rewe_process.parse_rewe_ebon(fd)
        print(type(jsonString))
        print(type(json.loads(jsonString)))
    return json.loads(jsonString)


@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
