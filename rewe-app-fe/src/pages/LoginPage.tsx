import { IonContent, IonIcon, IonPage } from "@ionic/react";
import { lockClosed } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router";

import useAuthStore from "../zustand/authStore";

const LoginPage: React.FC = () => {
	const tokenStore = useAuthStore((state) => state);

	const history = useHistory();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleUsernameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setPassword(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(
			`Submitting username: ${username} and password: ${password}`
		);

		// TODO: make api call to login endpoint and store token in tokenStore

		tokenStore.setToken("1234");
		history.push("/overview");
	};

	return (
		<IonPage>
			{/* <IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Login</IonTitle>
				</IonToolbar>
			</IonHeader> */}
			<IonContent fullscreen>
				<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
					<div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
						<IonIcon
							className="text-white w-10 h-10"
							size="large"
							aria-hidden="true"
							slot="start"
							ios={lockClosed}
							md={lockClosed}
						/>
						<h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-white">
							Sign in to your account
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form className="space-y-6" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="username"
									className="block text-sm font-medium leading-6 text-white"
								>
									Username
								</label>
								<div className="mt-2">
									<input
										id="username"
										name="username"
										type="username"
										autoComplete="username"
										placeholder="Harry"
										// required
										className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 p-3"
										onChange={handleUsernameChange}
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-white"
									>
										Password
									</label>
								</div>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										placeholder="Bawls"
										// required
										className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 p-3"
										onChange={handlePasswordChange}
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-rewe-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rewe-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
								>
									Sign in / up
								</button>
							</div>
						</form>

						{/* <p className="mt-10 text-center text-sm text-gray-400">
							or{" "}
							<a
								href="#"
								className="font-semibold leading-6 text-rewe-500 hover:text-rewe-400"
							>
								register
							</a>
						</p> */}
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default LoginPage;
