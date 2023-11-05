import { create } from "zustand";

import { Bill } from "../model/bill";

// Define the store state and actions
interface BillStore {
	bills: Bill[];
	addBill: (bill: Bill) => void;
	addBills: (bills: Bill[]) => void; // New action for adding a list of bills
}

// Create the Zustand store
const useBillStore = create<BillStore>((set) => ({
	bills: [],
	addBill: (bill) =>
		set((state) => ({
			bills: [...state.bills, bill],
		})),
	addBills: (bills) =>
		set((state) => ({
			bills: [...state.bills, ...bills],
		})),
}));

export default useBillStore;
