import React from "react";

import { Expense } from "../model/expense";

interface BillProps {
	expenses: Expense[];
}

const Bill: React.FC<BillProps> = ({ expenses }) => {
	return (
		<div>
			{expenses.map((expense) => (
				<div
					style={{
						backgroundColor: "grey",
						padding: 10,
						margin: 20,
						borderRadius: 5,
					}}
					key={expense.bill_id}
				>
					{expense.name} - {expense.value}
				</div>
			))}
		</div>
	);
};

export default Bill;
