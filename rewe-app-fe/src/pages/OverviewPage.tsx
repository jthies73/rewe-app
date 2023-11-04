import {
	Camera,
	CameraDirection,
	CameraResultType,
	CameraSource,
} from "@capacitor/camera";
import {
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonFabList,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { add, camera, document as doc } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

import Bill from "../components/Bill";
import { Expense } from "../model/expense";
import { uploadPhoto, uploadPDF } from "../utils/api";
import useAuthStore from "../zustand/authStore";
import useChartDataStore from "../zustand/chartDataStore";
import useExpenseStore from "../zustand/expenseStore";

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

const OverviewPage: React.FC = () => {
	const token = useAuthStore((state) => state.token);
	const chartDataStore = useChartDataStore((state) => state);
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const handleFileInputChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const expenses = await uploadPDF(files[0]);
			useExpenseStore.getState().addExpenses(expenses);
		}
	};

	useEffect(() => {
		const data = fetch(
			process.env.REACT_APP_API_BASE_URL + "/charts/daily",
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				chartDataStore.setDaily(data);
			});
	}, []);

	// Update the chart dimensions on resize
	// TODO: This is a hacky solution, find a better way to do this
	const [chartHeight, setChartHeight] = useState(window.innerHeight / 4);
	const [chartWidth, setChartWidth] = useState(
		window.innerWidth - 20 - document.getElementById("menu")!.clientWidth
	);
	window.addEventListener("resize", () => {
		setChartHeight(window.innerHeight / 4);
		setChartWidth(
			window.innerWidth -
				20 -
				document.getElementById("menu")!.clientWidth
		);
	});

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Overview</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<BarChart
					style={{ marginTop: 20 }}
					width={chartWidth}
					height={chartHeight}
					data={chartDataStore.daily}
				>
					<XAxis dataKey={"name"} />
					<YAxis id={"1"} />
					<YAxis id={"2"} />
					<Tooltip />
					<Legend />
					<Bar dataKey={"pv"} fill={"#8884d8"} />
					<Bar dataKey={"uv"} fill={"#82ca9d"} />
					<Bar dataKey={"amt"} fill={"#821f9f"} />
				</BarChart>
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

			<IonFab vertical="bottom" horizontal="end">
				<IonFabButton>
					<IonIcon icon={add} />
				</IonFabButton>
				<IonFabList side="top">
					<IonFabButton
						size="small"
						onClick={async () => {
							const photo = await takePhoto("front");
							if (!photo) return;
							const expenses = await uploadPhoto(photo);
							useExpenseStore.getState().addExpenses(expenses);
						}}
					>
						<IonIcon icon={camera} />
					</IonFabButton>
					<IonFabButton
						onClick={async () => {
							if (fileInputRef.current) {
								fileInputRef.current.click();
							}
						}}
					>
						<input
							hidden
							ref={fileInputRef}
							type="file"
							onChange={handleFileInputChange}
						/>
						<IonIcon icon={doc} />
					</IonFabButton>
				</IonFabList>
			</IonFab>
		</IonPage>
	);
};

export default OverviewPage;
