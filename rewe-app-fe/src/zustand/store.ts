import create from "zustand";

import { Expense } from "../model/expense";

// Define the store state and actions
interface ExpenseStore {
	expenses: Expense[];
	addExpense: (expense: Expense) => void;
	addExpenses: (expenses: Expense[]) => void; // New action for adding a list of expenses
}

// Create the Zustand store
const useExpenseStore = create<ExpenseStore>((set) => ({
	expenses: [],
	addExpense: (expense) =>
		set((state) => ({
			expenses: [...state.expenses, expense],
		})),
	addExpenses: (expenses) =>
		set((state) => ({
			expenses: [...state.expenses, ...expenses],
		})),
}));

export default useExpenseStore;
