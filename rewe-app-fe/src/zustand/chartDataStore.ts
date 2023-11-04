import { create } from "zustand";

import { Expense } from "../model/expense";

// Define the store state and actions
interface CartDataStore {
	daily: { day: string; value: number }[];
	setDaily: (daily: { day: string; value: number }[]) => void;
}

// Create the Zustand store
const useChartDataStore = create<CartDataStore>((set) => ({
	daily: [
		{
			day: "2021-01-01",
			value: 11.11,
		},
		{
			day: "2021-01-02",
			value: 11.11,
		},
	],
	setDaily: (daily) =>
		set(() => ({
			daily: daily,
		})),
}));

export default useChartDataStore;
