import { create } from "zustand";

import { Bill } from "../model/bill";

// Define the store state and actions
interface BillStore {
	bills: Bill[];
	addBill: (bill: Bill) => void;
	addBills: (bills: Bill[]) => void;
	clearBills: () => void;
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
	clearBills: () =>
		set(() => ({
			bills: [],
		})),
}));

export default useBillStore;
