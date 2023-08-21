import { Photo } from "@capacitor/camera";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import React, { useState } from "react";

import { generateFileNameWithDate } from "../utils/stringUtils";

interface ImageGridProps {
	photos: Photo[];
}

// A function that uploads a photo to the server in multipart/form-data format
async function uploadPhoto(photo: Photo) {
	// Create a FormData object
	const formData = new FormData();
	const fileName = generateFileNameWithDate(new Date());

	console.log("converting photo to blob...", photo.webPath);
	// Convert photo to Blob to append to FormData object
	await fetch(photo.webPath + "")
		.then((response) => response.blob())
		.then((blob) => {
			// Append the image file to the FormData object
			formData.append("file", blob, fileName);
		});

	console.log("uploading photo...", fileName);
	// Send FormData object to API
	const res = await fetch("https://rewe-app.yafa.app/api/images", {
		method: "POST",
		body: formData,
	});

	console.log("Upload successful!", res);
	return res;
}

const ImageGrid: React.FC<ImageGridProps> = ({ photos }) => {
	const [successfullUploads, setSuccessfullUploads] = useState<string[]>([]);

	return (
		<IonGrid>
			<IonRow>
				{photos.map((photo) => (
					<IonCol size-md="6" size-xs="12" key={photo.webPath}>
						<img
							key={photo.webPath}
							src={photo.webPath}
							style={{ width: "100%", height: "auto" }}
							alt={"whats that??"}
						/>
						<IonButton
							disabled={successfullUploads.includes(
								photo.webPath + ""
							)}
							onClick={async () => {
								const res = await uploadPhoto(photo);
								if (res.ok) {
									setSuccessfullUploads((prev) => [
										...prev,
										photo.webPath + "",
									]);
								}
							}}
						>
							Upload
						</IonButton>
						{successfullUploads.includes(photo.webPath + "") && (
							<div>Uploaded!</div>
						)}
					</IonCol>
				))}
			</IonRow>
		</IonGrid>
	);
};

export default ImageGrid;
