import { create } from "zustand";

import { Bill } from "../model/bill";

// Define the store state and actions
interface BillStore {
	bills: Bill[];
	addBill: (bill: Bill) => void;
	addBills: (bills: Bill[]) => void;
	clearBills: () => void;
	findBillsByDate: (date: string) => Bill[];
}

// Create the Zustand store
const useBillStore = create<BillStore>((set, get) => ({
	bills: [
		{
			id: 1,
			value: 10,
			datetime: "2024-01-05T21:56:00",
			expenses: [
				{
					id: 1,
					name: "Milk",
					quantity: 1,
					value: 2,
				},
				{
					id: 2,
					name: "Bread",
					quantity: 1,
					value: 3,
				},
				{
					id: 3,
					name: "Butter",
					quantity: 1,
					value: 5,
				},
			],
		},
		{
			id: 2,
			value: 20,
			datetime: "2024-01-05T21:56:00",
			expenses: [
				{
					id: 4,
					name: "Eggs",
					quantity: 1,
					value: 2,
				},
				{
					id: 5,
					name: "Cheese",
					quantity: 1,
					value: 3,
				},
				{
					id: 6,
					name: "Yogurt",
					quantity: 1,
					value: 5,
				},
			],
		},
		{
			id: 3,
			value: 30,
			datetime: "2024-01-06",
			expenses: [
				{
					id: 7,
					name: "Milk",
					quantity: 1,
					value: 2,
				},
				{
					id: 8,
					name: "Bread",
					quantity: 1,
					value: 3,
				},
				{
					id: 9,
					name: "Butter",
					quantity: 1,
					value: 5,
				},
			],
		},
		{
			id: 4,
			value: 40,
			datetime: "2024-01-05T21:56:00",
			expenses: [
				{
					id: 10,
					name: "Eggs",
					quantity: 1,
					value: 2,
				},
				{
					id: 11,
					name: "Cheese",
					quantity: 1,
					value: 3,
				},
				{
					id: 12,
					name: "Yogurt",
					quantity: 1,
					value: 5,
				},
			],
		},
	],
	addBill: (bill) => {
		set((state) => ({
			bills: [...state.bills, bill],
		}));
		console.log("Bill added", bill);
	},
	addBills: (bills) => {
		set((state) => ({
			bills: [...state.bills, ...bills],
		}));
		console.log("Bills added", bills);
	},
	clearBills: () => {
		set(() => ({
			bills: [],
		}));
		console.log("Bills cleared");
	},
	findBillsByDate: (date) => {
		return get().bills.filter((b) => b.datetime.startsWith(date));
	},
}));

export default useBillStore;
