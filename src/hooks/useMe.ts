// src/hooks/useMe.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import authApiRequest, { type User } from "@/apiRequest/auth";
import { useAuthStore } from "@/stores/auth.store";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      console.log(
        "🔄 Fetching /users/me. Cookies:",
        document.cookie || "(empty)",
      );
      // Set a 10-second timeout for auth check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const result = await authApiRequest.me();
        console.log("✅ /users/me success:", result);
        return result;
      } catch (err) {
        console.error("❌ /users/me error:", err);
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { status, data, error } = query;

  useEffect(() => {
    // ⛔ chưa có kết quả auth
    if (status === "pending") {
      console.log("⏳ useMe: pending");
      return;
    }

    if (status === "success") {
      console.log("✅ useMe: success with data:", data);
      setUser(data); // initialized = true
      return;
    }

    if (status === "error") {
      console.log("❌ useMe: error:", error);
      setUser(null); // initialized = true
    }
  }, [status, data, error, setUser]);

  return query;
}
