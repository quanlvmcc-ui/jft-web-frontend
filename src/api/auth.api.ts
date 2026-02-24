import { http } from "@/lib/http";

export type Role = "USER" | "EDITOR" | "ADMIN";

export type User = {
  id: string;
  email: string;
  role: Role;
};

export const authApi = {
  me: () => {
    console.log("📡 Calling authApi.me()");
    return http.get("users/me").json<User>();
  },
  logout: () => {
    console.log("📡 Calling authApi.logout()");
    return http.post("auth/logout");
  },
};
