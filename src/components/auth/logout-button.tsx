"use client";

import { useLogout } from "@/hooks/useLogout";
import { Button } from "../ui/button";

export default function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => logout()}
      disabled={isPending}
      className="text-red-600 hover:text-red-700"
    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
