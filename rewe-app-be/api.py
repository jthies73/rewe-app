from typing import Union

from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()


@app.get("/api/")
def read_root():
    return {"Hello": "World"}


@app.post("/api/images")
async def process_upload_image(image: UploadFile):
    try:
        contents = await image.read()
        # TODO: Process the file from here
    except Exception as e:
        return JSONResponse(content={"message": "There was an error uploading the file"}, status_code=400)
    finally:
        await image.close()

    return JSONResponse(content={"message": f"Successfully uploaded {image.filename}"})


@app.get("/api/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
