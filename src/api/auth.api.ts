import { http } from "@/lib/http";

export type User = {
  id: string;
  email: string;
  role: "admin" | "user";
};

export const authApi = {
  me: () => http.get("users/me").json<User>(),
  logout: () => http.post("auth/logout"),
};
