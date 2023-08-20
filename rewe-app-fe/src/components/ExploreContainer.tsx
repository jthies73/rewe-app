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
			<IonButton
				onClick={() => {
					navigator.mediaDevices.getUserMedia({
						video: {
							facingMode: "user",
						},
					});
				}}
			>
				Show my face
			</IonButton>
		</div>
	);
};

export default ExploreContainer;
