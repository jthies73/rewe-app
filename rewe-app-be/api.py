import io

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import db
import rewe_process


app = FastAPI()
# Configure CORS (Cross-Origin Resource Sharing) settings
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Define an OPTIONS route for CORS preflight requests
@app.options("/api/")
async def options_route():
    return {"methods": "OPTIONS, GET, POST, PUT, DELETE"}


@app.get("/api/")
def read_root():
    return {"Hello": "World"}


@app.post("/api/db/create")
async def create_db():
    db.create_database()


@app.put("/api/db/clean")
async def clean_db():
    db.clean()


@app.post("/api/images")
async def process_upload_image(file: UploadFile = File(...)):
    raise NotImplementedError("No image processing yet")


@app.post("/api/pdfs")
async def process_upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    await file.close()

    # TODO Retrieve user id here
    user_id = 1
    with io.BytesIO(contents) as fd:
        json = rewe_process.parse_rewe_ebon(fd, user_id)
    return json
