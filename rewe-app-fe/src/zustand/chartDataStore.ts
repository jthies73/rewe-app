import { create } from "zustand";

// Define the store state and actions
interface ChartDataStore {
	daily: { day: string; value: number; date: string }[];
	setDaily: (daily: { x: string; y: number }[]) => void;
	monthly: { month: string; value: number; date: string }[];
	setMonthly: (monthly: { x: string; y: number }[]) => void;
	yearly: { year: string; value: number; date: string }[];
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
				date: d.x,
				value: d.y,
			})),
		})),
	setMonthly: (monthly) =>
		set(() => ({
			monthly: monthly.map((m) => ({
				month: new Date(m.x).toLocaleDateString("en-US", {
					month: "short", // "Nov"
				}),
				date: m.x,
				value: m.y,
			})),
		})),
	setYearly: (yearly) =>
		set(() => ({
			yearly: yearly.map((y) => ({
				year: new Date(y.x).toLocaleDateString("en-US", {
					year: "numeric", // "2021"
				}),
				date: y.x,
				value: y.y,
			})),
		})),
}));

export default useChartDataStore;
