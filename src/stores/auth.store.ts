import { User } from "@/apiRequest/auth";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  initialized: false,

  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: Boolean(user),
      initialized: true, // 🔥 BẮT BUỘC
    })),

  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
      initialized: true,
    })),
}));
