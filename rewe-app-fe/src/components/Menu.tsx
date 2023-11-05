import {
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
} from "@ionic/react";
import { analytics, logOut, lockOpen } from "ionicons/icons";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useLocation } from "react-router-dom";

import useAuthStore from "../zustand/authStore";
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
];

const Menu: React.FC = () => {
	const location = useLocation();

	const tokenStore = useAuthStore((state) => state);

	let decodedToken;
	try {
		decodedToken = jwtDecode(tokenStore.token);
	} catch (error) {
		console.error("Invalid token format:", error);
	}

	return (
		<IonMenu id={"menu"} contentId="main" type="overlay">
			<IonContent className="flex flex-col justify-between">
				<IonList id="inbox-list" class="flex-1">
					<IonListHeader className="mb-5">EWER App</IonListHeader>
					<IonMenuToggle autoHide={false}>
						{decodedToken ? (
							<IonItem>
								<IonLabel>
									Logged in as {decodedToken.sub} until{" "}
									{new Date(
										decodedToken.exp! * 1000
									).toLocaleString("en-US", {
										month: "short",
										day: "2-digit",
									})}
								</IonLabel>
							</IonItem>
						) : (
							""
						)}
						{appPages.map((appPage, index) => {
							return (
								<IonItem
									key={index}
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
							);
						})}
						<IonItem
							routerLink={"#"}
							lines="full"
							detail={false}
							onClick={tokenStore.removeToken}
						>
							<IonIcon
								aria-hidden="true"
								slot="start"
								ios={logOut}
								md={logOut}
							/>
							<IonLabel>Logout</IonLabel>
						</IonItem>
					</IonMenuToggle>
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
