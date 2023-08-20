import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { CameraWeb } from "@capacitor/camera/dist/esm/web";
import { IonButton } from "@ionic/react";
import React from "react";

import "./ExploreContainer.css";

interface ContainerProps {
	name: string;
}

const takePhoto = async () => {
	const image = await Camera.getPhoto({
		quality: 90,
		allowEditing: true,
		resultType: CameraResultType.Uri,
		source: CameraSource.Camera,
	});

	// image.webPath will contain a path that can be set as an image src.
	// You can access the original file using image.path, which can be
	// passed to the Filesystem API to read the raw data of the image,
	// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
	const imageUrl = image.webPath;
};

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
	return (
		<div className="container">
			<strong>{name.toUpperCase()}</strong>
			<br />
			<br />
			<IonButton onClick={takePhoto}>Show my face</IonButton>
			<br />
			<br />
			<video id="video" autoPlay width="500" height="500"></video>{" "}
		</div>
	);
};

export default ExploreContainer;
