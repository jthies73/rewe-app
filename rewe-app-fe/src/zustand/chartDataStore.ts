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
	daily: [],
	monthly: [],
	yearly: [],
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
