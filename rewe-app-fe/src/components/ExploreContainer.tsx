import {
	Camera,
	CameraDirection,
	CameraResultType,
	CameraSource,
	Photo,
} from "@capacitor/camera";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import React, { useState } from "react";

import "./ExploreContainer.css";

interface ContainerProps {
	name: string;
}

const takePhoto = async (direction: "rear" | "front") => {
	return await Camera.getPhoto({
		quality: 100,
		allowEditing: true,
		resultType: CameraResultType.Uri,
		source: CameraSource.Camera,
		direction:
			direction === "rear" ? CameraDirection.Rear : CameraDirection.Front,
	});

	// image.webPath will contain a path that can be set as an image src.
	// You can access the original file using image.path, which can be
	// passed to the Filesystem API to read the raw data of the image,
	// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)

	// return photo.webPath;
};

// A function that uploads a photo to the server in multipart/form-data format
async function uploadPhoto(photo: Photo) {
	// Create a FormData object
	const formData = new FormData();

	// Convert photo to Blob to append to FormData object
	await fetch(photo.webPath + "")
		.then((response) => response.blob())
		.then((blob) => {
			// Append the image file to the FormData object
			formData.append("photo", blob, "photo.jpg");

			// Append other fields if needed
			formData.append("field1", "value1");
			formData.append("field2", "value2");
		});

	// Send FormData object to API
	const res = await fetch("https://rewe-app.yafa.app/api/images", {
		method: "POST",
		body: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
		.then((res) => res.json())
		.catch((err) => console.error(err));

	console.log("Upload successful! " + res);
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
	const [photos, setPhotos] = useState<Photo[]>([]);

	return (
		<div className="container">
			<strong>{name.toUpperCase()}</strong>
			<br />
			<br />
			<IonButton
				onClick={async () => {
					const photo = await takePhoto("front");
					if (!photo) return;
					setPhotos((photos) => [...photos, photo]);
				}}
			>
				Show my face
			</IonButton>
			<br />
			<br />
			<IonButton
				onClick={async () => {
					const photo = await takePhoto("rear");
					if (!photo) return;
					setPhotos((photos) => [...photos, photo]);
				}}
			>
				Rear cam test
			</IonButton>
			<br />
			<br />

			<IonGrid>
				<IonRow>
					{photos.map((photo) => (
						<IonCol size-md="6" size-xs="12" key={photo.webPath}>
							<img
								key={photo.webPath}
								src={photo.webPath}
								style={{ width: "100%", height: "auto" }}
								alt={name}
							/>
							<IonButton onClick={() => uploadPhoto(photo)}>
								Upload
							</IonButton>
						</IonCol>
					))}
				</IonRow>
			</IonGrid>
		</div>
	);
};

export default ExploreContainer;
