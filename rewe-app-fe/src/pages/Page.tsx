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
import { useParams } from "react-router";

import ExploreContainer from "../components/ExploreContainer";
import "./Page.css";

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

const Page: React.FC = () => {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const { name } = useParams<{ name: string }>();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{name}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{name + "TEST"}</IonTitle>
					</IonToolbar>
				</IonHeader>
				<ExploreContainer photos={photos} name={name} />
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

export default Page;
