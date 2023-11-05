import React from "react";

import { Expense } from "../model/expense";

interface BillComponentProps {
	bill_id: number;
	username: string;
	date: string;
	storeName: string;
	total: number;
	expenses: Expense[];
}

// TODO: Add styling with TailwindCSS
const BillComponent: React.FC<BillComponentProps> = ({
	bill_id,
	expenses,
	total,
	storeName,
	date,
	username,
}) => {
	return (
		<div
			style={{
				borderRadius: "10px",
				padding: "30px",
				margin: "20px",
				backgroundColor: "#fff",
				maxWidth: "400px",
			}}
		>
			<h3 style={{ color: "gray", fontWeight: "bolder", marginTop: 5 }}>
				Receipt from {storeName} - {bill_id}
			</h3>
			<h1
				style={{
					color: "black",
					marginTop: 10,
					fontWeight: "bolder",
					fontSize: 40,
				}}
			>
				${total.toFixed(2)}
			</h1>
			<p
				style={{
					color: "grey",
					fontWeight: "bold",
					fontSize: 14,
					marginTop: 5,
				}}
			>
				Paid on {date} by user {username}
			</p>
			<div style={{ height: "2px", backgroundColor: "#ddd" }}></div>
			<ul style={{ listStyleType: "none", padding: "0" }}>
				{expenses.map((expense) => (
					<li key={expense.id} style={{}}>
						<div>
							<div
								style={{
									marginTop: 5,
									color: "black",
									fontWeight: "bold",
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<p>{expense.name}</p>
								<p>${expense.value.toFixed(2)}</p>
							</div>
							<div
								style={{
									color: "grey",
									fontSize: 12,
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<p>Quantity</p>
								<p>{expense.quantity || 1}</p>
							</div>
						</div>
						<div
							style={{
								height: "1px",
								backgroundColor: "#ddd",
								marginTop: 5,
							}}
						></div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default BillComponent;
