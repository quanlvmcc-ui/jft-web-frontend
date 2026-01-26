// src/hooks/useMe.ts
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
  });

  const { data, isError } = query;

  useEffect(() => {
    if (data) {
      setUser(data);
    }
    if (isError) {
      setUser(null);
    }
  }, [data, isError, setUser]);

  return query;
}
