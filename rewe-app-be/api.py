from typing import Union

from fastapi import FastAPI, File, UploadFile

import pandas as pd

app = FastAPI()
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
    try:
        contents = await file.read()
        # TODO: Process file from here
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
       await file.close()

    return {"message": f"Successfully uploaded {file.filename}"}


@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
