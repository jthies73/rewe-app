import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonNote,
} from "@ionic/react";
import { camera, analytics, person } from "ionicons/icons";
import React from "react";
import { useLocation } from "react-router-dom";

import "./Menu.css";

interface AppPage {
	url: string;
	iosIcon: string;
	mdIcon: string;
	title: string;
}

const appPages: AppPage[] = [
	{
		title: "Camera",
		url: "/camera",
		iosIcon: camera,
		mdIcon: camera,
	},
	{
		title: "Expenses",
		url: "/expenses",
		iosIcon: analytics,
		mdIcon: analytics,
	},
	{
		title: "Users",
		url: "/users",
		iosIcon: person,
		mdIcon: person,
	},
];

const Menu: React.FC = () => {
	const location = useLocation();

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
					<IonListHeader>REME App</IonListHeader>
					<br />
					{appPages.map((appPage, index) => {
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItem
									className={
										location.pathname === appPage.url
											? "selected"
											: ""
									}
									routerLink={appPage.url}
									routerDirection="none"
									lines="none"
									detail={false}
								>
									<IonIcon
										aria-hidden="true"
										slot="start"
										ios={appPage.iosIcon}
										md={appPage.mdIcon}
									/>
									{/*Title Capitalized*/}
									<IonLabel>{appPage.title}</IonLabel>
								</IonItem>
								<div style={{ marginBottom: 5 }} />
							</IonMenuToggle>
						);
					})}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
