import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";

type User = {
	id: string;
	name: string;
	email: string;
};

const UsersPage: React.FC = () => {
	const [users] = useState<User[]>([]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Users</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
							</tr>
						))}
					</tbody>
				</table>
			</IonContent>
		</IonPage>
	);
};

export default UsersPage;
