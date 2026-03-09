import { http } from "@/lib/http";
import type { UserRole } from "@/types/enums";

export type User = {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
};

const authApiRequest = {
  me: () => http.get("users/me").json<User>(),
  logout: () => http.post("auth/logout"),
};

export default authApiRequest;
