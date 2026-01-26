import { http } from "@/lib/http";

export type User = {
  id: string;
  email: string;
  role: "admin" | "user";
};

export const authApi = {
  me: () => http.get("me").json<User>(),
};
