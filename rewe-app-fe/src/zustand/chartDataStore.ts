import { create } from "zustand";


// Define the store state and actions
interface ChartDataStore {
	daily: { day: string; value: number }[];
	setDaily: (daily: { day: string; value: number }[]) => void;
	monthly: { month: string; value: number }[];
	setMonthly: (monthly: { month: string; value: number }[]) => void;
	yearly: { year: string; value: number }[];
	setYearly: (yearly: { year: string; value: number }[]) => void;
}

// Create the Zustand store
const useChartDataStore = create<ChartDataStore>((set) => ({
	daily: [
		{
			day: new Date().toLocaleDateString("en-US", {
				month: "short", // "Nov"
				day: "2-digit", // "05"
			}),
			value: 10,
		},
		{
			day: new Date().toLocaleDateString("en-US", {
				month: "short", // "Nov"
				day: "2-digit", // "05"
			}),
			value: 5,
		},
		{
			day: new Date().toLocaleDateString("en-US", {
				month: "short", // "Nov"
				day: "2-digit", // "05"
			}),
			value: 5,
		},
	],
	monthly: [
		{
			month: "Jan",
			value: 3,
		},
		{
			month: "Feb",
			value: 25,
		},
	],
	yearly: [
		{
			year: "2020",
			value: 4932,
		},
		{
			year: "2021",
			value: 3598,
		},
	],
	setDaily: (daily: { day: string; value: number }[]) =>
		set(() => ({
			daily: daily.map((d) => ({
				day: new Date(d.day).toLocaleDateString("en-US", {
					month: "short", // "Nov"
					day: "2-digit", // "05"
				}),
				value: d.value,
			})),
		})),
	setMonthly: (monthly) =>
		set(() => ({
			monthly: monthly,
		})),
	setYearly: (yearly) =>
		set(() => ({
			yearly: yearly,
		})),
}));

export default useChartDataStore;