import { Expense } from "./expense";

export interface Bill {
    id: number;
    value: number;
    date: string;
    expenses: Expense[];
}