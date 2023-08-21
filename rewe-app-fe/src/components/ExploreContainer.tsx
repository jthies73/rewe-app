import {
	Camera,
	CameraDirection,
	CameraResultType,
	CameraSource,
	Photo,
} from "@capacitor/camera";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import React, { useState } from "react";

import { generateFileNameWithDate } from "../utils/stringUtils";
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
};

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
			formData.append("image", blob, fileName);
		});

	console.log("uploading photo...", fileName);
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

	console.log("Upload successful!", res);
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
