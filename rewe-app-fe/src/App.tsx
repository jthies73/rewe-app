import {
	IonApp,
	IonRouterOutlet,
	IonSplitPane,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import React from "react";
import { Redirect, Route } from "react-router-dom";

import Menu from "./components/Menu";
import LoginPage from "./pages/LoginPage";
import OverviewPage from "./pages/OverviewPage";

/* Tailwind CSS */
import "./theme/tailwind.css";

/* Theme variables */
import "./theme/variables.css";
import useAuthStore from "./zustand/authStore";

setupIonicReact();

const App: React.FC = () => {
	const isAuthenticated = useAuthStore((state) => state.token) !== "";

	return (
		<IonApp>
			<IonReactRouter>
				<IonSplitPane contentId="main">
					{isAuthenticated ? (
						<>
							<Menu />
							<IonRouterOutlet id="main">
								<Route path="/*">
									<Redirect to="/overview" />
								</Route>
								<Route path="/overview" exact={true}>
									<OverviewPage />
								</Route>
								<Route path="/auth" exact={true}>
									<LoginPage />
								</Route>
							</IonRouterOutlet>
						</>
					) : (
						<IonRouterOutlet id="main">
							<Route path="/*">
								<Redirect exact to="/auth" />
							</Route>
							<Route path="/auth" exact={true}>
								<LoginPage />
							</Route>
						</IonRouterOutlet>
					)}
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	);
};

export default App;
