import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React from "react";

const ExpensesPage: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Expenses</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<div>Some Content</div>
			</IonContent>
		</IonPage>
	);
};

export default ExpensesPage;
