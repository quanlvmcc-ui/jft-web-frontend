import { User } from "@/api/auth.api";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: Boolean(user),
    })),

  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),
}));
