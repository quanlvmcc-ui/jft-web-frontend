"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function DashboardUsersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [router, user]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nguoi dung</h1>
        <p className="text-muted-foreground">
          Trang nay chi danh cho ADMIN va da san sang skeleton route.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Buoc tiep theo: them bang danh sach nguoi dung va bo loc theo role.
        </p>
      </div>
    </div>
  );
}
