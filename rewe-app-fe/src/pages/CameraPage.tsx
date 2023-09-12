import {
	Camera,
	CameraDirection,
	CameraResultType,
	CameraSource,
} from "@capacitor/camera";
import {
	IonButtons,
	IonChip,
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
import { camera, information } from "ionicons/icons";
import React, { useState } from "react";

import Bill from "../components/Bill";
import { Expense } from "../model/expense";
import { uploadPhoto, uploadPDF } from "../utils/api";
import useExpenseStore from "../zustand/store";

async function takePhoto(direction: "rear" | "front") {
	return await Camera.getPhoto({
		quality: 100,
		allowEditing: true,
		resultType: CameraResultType.Uri,
		source: CameraSource.Camera,
		direction:
			direction === "rear" ? CameraDirection.Rear : CameraDirection.Front,
	});
}

async function selectFile() {
	// TODO: Implement file selection for web
}

const CameraPage: React.FC = () => {
	const billMap = useExpenseStore((state) => state.expenses).reduce(
		(acc, expense) => {
			if (!acc[expense.bill_id]) {
				acc[expense.bill_id] = [];
			}
			acc[expense.bill_id].push(expense);
			return acc;
		},
		{} as { [key: number]: Expense[] }
	);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileInputChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			setSelectedFile(files[0]);
			const expenses = await uploadPDF(files[0]);
			useExpenseStore.getState().addExpenses(expenses);
			setSelectedFile(null);
		}
	};

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

			<IonContent>
				<div className={"p-2"}>
					<label className={"text-lg font-semibold"}>
						Select a File:
					</label>
					<br />
					<br />
					<input
						className={"border-2 border-gray-400 rounded-md p-2"}
						type="file"
						accept="application/pdf"
						onChange={handleFileInputChange}
					/>
				</div>
				{Object.entries(billMap).map(([bill_id, expenses]) => (
					<Bill
						key={bill_id}
						bill_id={parseInt(bill_id)}
						expenses={expenses}
						total={expenses.reduce(
							(acc, expense) => acc + expense.value,
							0
						)}
						storeName={"REWE"}
						date={"2021-01-01"}
						user_id={1}
					/>
				))}
			</IonContent>

			{/* Add the fab button with the camera icon */}
			<IonFab vertical={"bottom"} horizontal={"end"}>
				<IonFabButton
					onClick={async () => {
						const photo = await takePhoto("rear");
						if (!photo) return;
						const expenses = await uploadPhoto(photo);
						useExpenseStore.getState().addExpenses(expenses);
					}}
				>
					<IonIcon icon={camera} />
				</IonFabButton>
			</IonFab>
		</IonPage>
	);
};

export default CameraPage;
