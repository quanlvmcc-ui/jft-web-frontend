// src/hooks/useMe.ts
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi, type User } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      // Set a 10-second timeout for auth check
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        return await authApi.me();
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
    if (status === "pending") return;

    if (status === "success") {
      console.log("✅ Auth success:", data);
      setUser(data); // initialized = true
      return;
    }

    if (status === "error") {
      console.log("❌ Auth error:", error);
      setUser(null); // initialized = true
    }
  }, [status, data, error, setUser]);

  return query;
}
