import { IonButton } from "@ionic/react";
import React from "react";

import "./ExploreContainer.css";

interface ContainerProps {
	name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
	return (
		<div className="container">
			<strong>{name.toUpperCase()}</strong>
			<br />
			<br />
			<IonButton
				onClick={async () => {
					if (
						"mediaDevices" in navigator &&
						"getUserMedia" in navigator.mediaDevices
					) {
						console.log("Let's get this party started");
					} else {
						console.log("Sorry, camera not available.");
					}

					// Get access to the camera
					void navigator.mediaDevices.getUserMedia({
						video: {
							facingMode: "user",
						},
					});

					// List cameras and microphones
					const devices =
						await navigator.mediaDevices.enumerateDevices();

					console.log(devices);
				}}
			>
				Show my face
			</IonButton>
			<br />
			<br />
			<video id="video" autoPlay width="500" height="500"></video>{" "}
		</div>
	);
};

export default ExploreContainer;
