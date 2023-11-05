import { Expense } from "./expense";

export interface Bill {
	id: number;
	value: number;
	datetime: string;
	expenses: Expense[];
}
