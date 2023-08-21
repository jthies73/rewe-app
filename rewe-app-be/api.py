from typing import Union

from fastapi import FastAPI, UploadFile

app = FastAPI()


@app.get("/api/")
def read_root():
    return {"Hello": "World"}


@app.post("/api/images")
async def process_upload_image(image: UploadFile):
    try:
        contents = await image.file.read()
        # TODO: Process file from here
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
       await image.file.close()

    return {"message": f"Successfully uploaded {image.filename}"}


@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
