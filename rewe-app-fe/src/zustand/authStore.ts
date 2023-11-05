import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store state and actions
interface AuthStore {
	token: string;
	setToken: (token: string) => void;
	removeToken: () => void;
	getExpiration: () => Date;
	getUsername: () => string;
	isAuthenticated: () => boolean;
}

// Create the Zustand store
const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			token: "",
			setToken: (token: string) => set({ token }),
			removeToken: () => set({ token: "" }),
			getExpiration: () => {
				try {
					const token = get().token;
					const decodedToken = jwtDecode(token);
					const exp = decodedToken.exp;
					if (!exp) return new Date(0);
					return new Date(exp * 1000);
				} catch (error) {
					return new Date(0);
				}
			},
			getUsername: () => {
				try {
					const token = get().token;
					const decodedToken = jwtDecode(token);
					const username = decodedToken.sub;
					if (!username) return "";
					return username;
				} catch (error) {
					return "";
				}
			},
			isAuthenticated: () => {
				try {
					const token = get().token;
					const decodedToken = jwtDecode(token);
					const exp = decodedToken.exp;
					if (!exp) return false;
					return Date.now() < exp * 1000;
				} catch (error) {
					return false;
				}
			},
		}),

		{
			name: "auth-storage",
		}
	)
);

export default useAuthStore;
