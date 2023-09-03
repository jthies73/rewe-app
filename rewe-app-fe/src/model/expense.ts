export interface Expense {
	expense_id: number;
	bill_id: number;
	user_id: number;
	name: string;
	value: number;
	// price_per_item: number;
	// weight: number;
	// price_per_kg: number;
	tags: string;
	date: string;
	quantity: number;
}
