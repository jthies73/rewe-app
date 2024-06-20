import { create } from "zustand";

// Define the store state and actions
interface ChartDataStore {
	daily: {
		timeData: { day: string; value: number; date: string }[];
		productData: { name: string; value: number }[];
	};
	setDaily: (daily: {
		time_data: [string, number][];
		product_data: any[];
	}) => void;
	monthly: {
		timeData: { month: string; value: number; date: string }[];
		productData: { name: string; value: number }[];
	};
	setMonthly: (monthly: {
		time_data: [string, number][];
		product_data: any[];
	}) => void;
	yearly: {
		timeData: { year: string; value: number; date: string }[];
		productData: { name: string; value: number }[];
	};
	setYearly: (yearly: {
		time_data: [string, number][];
		product_data: any[];
	}) => void;
}

// Create the Zustand store
const useChartDataStore = create<ChartDataStore>((set) => ({
	daily: { timeData: [], productData: [] },
	monthly: { timeData: [], productData: [] },
	yearly: { timeData: [], productData: [] },
	setDaily: (daily) => {
		set(() => ({
			daily: {
				timeData: daily.time_data.map((d) => ({
					day: new Date(d[0]).toLocaleDateString("en-US", {
						month: "short", // "Nov"
						day: "2-digit", // "05"
					}),
					date: d[0] as string,
					value: d[1] as number,
				})),
				productData: daily.product_data.map((p) => ({
					name: p[0] as string,
					value: p[1] as number,
				})),
			},
		}));
		console.log("daily chart data set", daily);
	},
	setMonthly: (monthly) => {
		set(() => ({
			monthly: {
				timeData: monthly.time_data.map((m) => ({
					month: new Date(m[0]).toLocaleDateString("en-US", {
						month: "short", // "Nov"
					}),
					date: m[0] as string,
					value: m[1] as number,
				})),
				productData: monthly.product_data.map((p) => ({
					name: p[0] as string,
					value: p[1] as number,
				})),
			},
		}));
		console.log("monthly chart data set", monthly);
	},
	setYearly: (yearly) => {
		set(() => ({
			yearly: {
				timeData: yearly.time_data.map((y) => ({
					year: new Date(y[0]).toLocaleDateString("en-US", {
						year: "numeric", // "2021"
					}),
					date: y[0] as string,
					value: y[1] as number,
				})),
				productData: yearly.product_data.map((p) => ({
					name: p[0] as string,
					value: p[1] as number,
				})),
			},
		}));
		console.log("yearly chart data set", yearly);
	},
}));

export default useChartDataStore;
