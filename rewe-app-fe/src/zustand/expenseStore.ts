import { create } from "zustand";

import { Expense } from "../model/expense";

// Define the store state and actions
interface ExpenseStore {
	expenses: Expense[];
	addExpense: (expense: Expense) => void;
	addExpenses: (expenses: Expense[]) => void; // New action for adding a list of expenses
}

// Create the Zustand store
const useExpenseStore = create<ExpenseStore>((set) => ({
	expenses: [
		{
			expense_id: 9999,
			bill_id: 9999,
			user_id: 9999,
			name: "Sample Expense 1",
			value: 11.11,
			tags: "Breakfast",
			date: "2021-01-01",
			quantity: 1,
		},
		{
			expense_id: 9999,
			bill_id: 9999,
			user_id: 9999,
			name: "Sample Expense 2",
			value: 11.11,
			tags: "Alcohol",
			date: "2021-01-02",
			quantity: 1,
		},
	],
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
