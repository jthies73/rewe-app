import {
	Camera,
	CameraDirection,
	CameraResultType,
	CameraSource,
	Photo,
} from "@capacitor/camera";
import {
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import React, { useState } from "react";

import ExploreContainer from "../components/ImageGrid";

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

const CameraPage: React.FC = () => {
	const [photos, setPhotos] = useState<Photo[]>([]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Camera</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<ExploreContainer photos={photos} />
			</IonContent>

			{/* Add the fab button with the camera icon */}
			<IonFab vertical={"bottom"} horizontal={"end"}>
				<IonFabButton
					onClick={async () => {
						const photo = await takePhoto("front");
						if (!photo) return;
						setPhotos((photos) => [...photos, photo]);
					}}
				>
					<IonIcon icon={camera} />
				</IonFabButton>
			</IonFab>
		</IonPage>
	);
};

export default CameraPage;
