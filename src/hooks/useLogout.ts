import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user in zustand store
      logoutStore();

      // clear react-query cache
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
}
