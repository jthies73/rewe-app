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
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { add, camera, document as doc } from "ionicons/icons";
import React, { useEffect, useRef } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import Bill from "../components/Bill";
import {
	uploadPhoto,
	uploadPDF,
	fetchYearlyChartData,
	fetchMonthyChartData,
	fetchDailyChartData,
	fetchBills,
} from "../utils/api";
import useAuthStore from "../zustand/authStore";
import useBillStore from "../zustand/billStore";
import useChartDataStore from "../zustand/chartDataStore";

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
	const fileInputRef = useRef<HTMLInputElement>(null);

	const token = useAuthStore((state) => state.token);
	const getUsername = useAuthStore((state) => state.getUsername);
	const chartDataStore = useChartDataStore((state) => state);
	const billStore = useBillStore((state) => state);

	const handleFileInputChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const bill = await uploadPDF(files[0], token);
			billStore.addBill(bill);
		}
	};

	const currentYear = new Date().toLocaleString("en-US", { year: "numeric" });
	// current month and year as string based on current date
	const [dailyMonth, setDailyMonth] = React.useState(
		new Date().toLocaleString("en-US", { month: "2-digit" })
	);
	const [dailyYear, setDailyYear] = React.useState(currentYear);
	const [monthlyYear, setMonthlyYear] = React.useState(currentYear);

	const years = Array.from(
		{ length: 11 },
		(_, i) => parseInt(currentYear) - 5 + i + ""
	);

	useEffect(() => {
		try {
			fetchDailyChartData(token, dailyMonth, dailyYear).then((data) => {
				if (data) {
					console.log("CHARTDATA Daily: ", data);
					chartDataStore.setDaily(data);
				} else {
					chartDataStore.setDaily([]);
					throw new Error(
						`No daily chartdata in payload: ${JSON.stringify(data)}`
					);
				}
			});
			fetchMonthyChartData(token, monthlyYear).then((data) => {
				if (data) {
					console.log("CHARTDATA Monthly: ", data);
					chartDataStore.setMonthly(data);
				} else {
					chartDataStore.setMonthly([]);
					throw new Error(
						`No monthly chartdata in payload: ${JSON.stringify(
							data
						)}`
					);
				}
			});
			fetchYearlyChartData(token).then((data) => {
				if (data) {
					console.log("CHARTDATA Yearly: ", data);
					chartDataStore.setYearly(data);
				} else {
					chartDataStore.setYearly([]);
					throw new Error(
						`No yearly chartdata in payload: ${JSON.stringify(
							data
						)}`
					);
				}
			});
			fetchBills(token).then((data) => {
				if (data) {
					console.log("BILLDATA: ", data);
					billStore.addBills(data);
				} else {
					throw new Error(
						`No bills in payload: ${JSON.stringify(data)}`
					);
				}
			});
		} catch (error) {
			console.error(
				"NetworkError when attempting to fetch resource.",
				error
			);
		}
	}, [dailyMonth, dailyYear, monthlyYear]);

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
				<div>ChartData Daily Count: {chartDataStore.daily.length}</div>
				<div>
					ChartData Monthly Count: {chartDataStore.monthly.length}
				</div>
				<div>
					ChartData Yearly Count: {chartDataStore.yearly.length}
				</div>
				{/* Dropdown for selecting month and year */}
				<div className="flex flex-row justify-start">
					<div className="flex flex-row justify-start space-x-4">
						<IonSelect
							value={dailyMonth}
							placeholder="Select Month"
							onIonChange={(e) => setDailyMonth(e.detail.value)}
						>
							<IonSelectOption value="01">
								January
							</IonSelectOption>
							<IonSelectOption value="02">
								February
							</IonSelectOption>
							<IonSelectOption value="03">March</IonSelectOption>
							<IonSelectOption value="04">April</IonSelectOption>
							<IonSelectOption value="05">May</IonSelectOption>
							<IonSelectOption value="06">June</IonSelectOption>
							<IonSelectOption value="07">July</IonSelectOption>
							<IonSelectOption value="08">August</IonSelectOption>
							<IonSelectOption value="09">
								September
							</IonSelectOption>
							<IonSelectOption value="10">
								October
							</IonSelectOption>
							<IonSelectOption value="11">
								November
							</IonSelectOption>
							<IonSelectOption value="12">
								December
							</IonSelectOption>
						</IonSelect>
						<IonSelect
							value={dailyYear}
							placeholder="Select Year"
							onIonChange={(e) => setDailyYear(e.detail.value)}
						>
							{years.map((year) => (
								<IonSelectOption key={year} value={year}>
									{year}
								</IonSelectOption>
							))}
						</IonSelect>
					</div>
					<div className="flex-1"></div>
				</div>
				<ResponsiveContainer width={"100%"} height="30%">
					<BarChart
						style={{ marginTop: 20 }}
						data={chartDataStore.daily}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="day" type="category" />
						<YAxis dataKey="value" type="number" unit={" €"} />
						<Legend />
						<Tooltip contentStyle={{ color: "black" }} />
						<Bar
							dataKey="value"
							fill="#e08428"
							name="total amount spent"
							unit={" €"}
						/>
					</BarChart>
				</ResponsiveContainer>
				{/* Dropdown for selecting year */}
				<IonSelect
					value={monthlyYear}
					placeholder="Select Year"
					onIonChange={(e) => setMonthlyYear(e.detail.value)}
				>
					{years.map((year) => (
						<IonSelectOption key={year} value={year}>
							{year}
						</IonSelectOption>
					))}
				</IonSelect>
				<ResponsiveContainer width={"100%"} height="30%">
					<BarChart
						style={{ marginTop: 20 }}
						data={chartDataStore.monthly}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" type="category" />
						<YAxis dataKey="value" type="number" unit={" €"} />
						<Legend />
						<Tooltip contentStyle={{ color: "black" }} />
						<Bar
							dataKey="value"
							fill="#e08428"
							name="total amount spent"
							unit={" €"}
						/>
					</BarChart>
				</ResponsiveContainer>
				<ResponsiveContainer width={"100%"} height="30%">
					<BarChart
						style={{ marginTop: 20 }}
						data={chartDataStore.yearly}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="year" type="category" />
						<YAxis dataKey="value" type="number" unit={" €"} />
						<Legend />
						<Tooltip contentStyle={{ color: "black" }} />
						<Bar
							dataKey="value"
							fill="#1fc7bf"
							name="total amount spent"
							unit={" €"}
						/>
					</BarChart>
				</ResponsiveContainer>

				<div>Bill Count: {billStore.bills.length}</div>
				{billStore.bills.map((bill) => (
					<Bill
						key={bill.id}
						bill_id={bill.id}
						expenses={bill.expenses}
						total={bill.value}
						storeName={"REWE"}
						date={new Date(bill.datetime).toLocaleDateString(
							"en-US",
							{
								day: "2-digit",
								month: "short",
								year: "numeric",
							}
						)}
						username={getUsername()}
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
							const bill = await uploadPhoto(photo, token);
							billStore.addBill(bill);
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
