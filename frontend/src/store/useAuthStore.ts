import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("freshmart_token", token);
          localStorage.setItem("freshmart_user", JSON.stringify(user));
        }
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("freshmart_token");
          localStorage.removeItem("freshmart_user");
        }
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "freshmart-auth",
    }
  )
);
