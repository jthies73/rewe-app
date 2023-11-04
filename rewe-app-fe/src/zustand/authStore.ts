import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store state and actions
interface AuthStore {
	token: string;
	setToken: (token: string) => void;
	removeToken: () => void;
}

// Create the Zustand store
const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			token: "",
			setToken: (token: string) => set({ token }),
			removeToken: () => set({ token: "" }),
		}),

		{
			name: "auth-storage",
		}
	)
);

export default useAuthStore;
