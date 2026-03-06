"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/auth/logout-button";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="font-semibold">JFT</div>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {user.email}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Tài Khoản
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
