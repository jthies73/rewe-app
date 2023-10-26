import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
} from "@ionic/react";
import { camera, analytics, person, lockClosed } from "ionicons/icons";
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
		title: "Overview",
		url: "/overview",
		iosIcon: analytics,
		mdIcon: analytics,
	},
	{
		title: "Login",
		url: "/auth/login",
		iosIcon: lockClosed,
		mdIcon: lockClosed,
	},
];

const Menu: React.FC = () => {
	const location = useLocation();

	return (
		<IonMenu id={"menu"} contentId="main" type="overlay">
			<IonContent className="flex flex-col justify-between">
				<IonList id="inbox-list" class="flex-1">
					<IonListHeader className="mb-5">EWER App</IonListHeader>
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
