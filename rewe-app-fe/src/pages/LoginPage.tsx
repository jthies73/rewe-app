import {
	IonContent,
	IonIcon,
	IonPage,
	IonToast,
} from "@ionic/react";
import { lockClosed } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import useAuthStore from "../zustand/authStore";

const LoginPage: React.FC = () => {
	const tokenStore = useAuthStore((state) => state);

	const history = useHistory();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState<string | undefined>(undefined);

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

		fetch(process.env.REACT_APP_API_BASE_URL + "/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})
			.then((response) => {
				// throw error when status code is not 201
				if (response.status !== 200) {
					console.error("Login failed", response);
					setError("Login failed");
					throw new Error("Login failed");
				} else return response;
			})
			.then((response) => response.json())
			.then((data) => {
				if (data.token) {
					console.log("Success:", data);
					tokenStore.setToken(data.token);
					history.push("/overview");
				} else throw new Error("Invalid Payload", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
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
										placeholder="Rainer"
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
										placeholder="Zufall"
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
									Log in
								</button>
							</div>
						</form>

						<p className="mt-10 text-center text-sm text-gray-400">
							or{" "}
							<Link
								to={"/auth/register"}
								className="font-semibold leading-6 text-rewe-500 hover:text-rewe-400"
							>
								register
							</Link>
						</p>
					</div>
				</div>
				<IonToast
					onDidDismiss={() => setError(undefined)}
					className="mb-10"
					color={"danger"}
					isOpen={!!error}
					message={error}
					duration={5000}
				></IonToast>
			</IonContent>
		</IonPage>
	);
};

export default LoginPage;
