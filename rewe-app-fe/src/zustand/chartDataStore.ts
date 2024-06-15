import { create } from "zustand";

// Define the store state and actions
interface ChartDataStore {
	daily: { day: string; value: number }[];
	setDaily: (daily: { x: string; y: number }[]) => void;
	monthly: { month: string; value: number }[];
	setMonthly: (monthly: { x: string; y: number }[]) => void;
	yearly: { year: string; value: number }[];
	setYearly: (yearly: { x: string; y: number }[]) => void;
}

// Create the Zustand store
const useChartDataStore = create<ChartDataStore>((set) => ({
	daily: [],
	monthly: [],
	yearly: [],
	setDaily: (daily) =>
		set(() => ({
			daily: daily.map((d) => ({
				day: new Date(d.x).toLocaleDateString("en-US", {
					month: "short", // "Nov"
					day: "2-digit", // "05"
				}),
				value: d.y,
			})),
		})),
	setMonthly: (monthly) =>
		set(() => ({
			monthly: monthly.map((m) => ({
				month: new Date(m.x).toLocaleDateString("en-US", {
					month: "short", // "Nov"
				}),
				value: m.y,
			})),
		})),
	setYearly: (yearly) =>
		set(() => ({
			yearly: yearly.map((y) => ({
				year: new Date(y.x).toLocaleDateString("en-US", {
					year: "numeric", // "2021"
				}),
				value: y.y,
			})),
		})),
}));

export default useChartDataStore;
