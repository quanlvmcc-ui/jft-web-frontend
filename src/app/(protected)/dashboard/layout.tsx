"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useAuthStore } from "@/stores/auth.store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const router = useRouter();

  // Role-based access control
  React.useEffect(() => {
    if (user && !["EDITOR", "ADMIN"].includes(user.role)) {
      router.replace("/exam"); // Redirect students to exam page
    }
  }, [user, router]);

  // Only EDITOR/ADMIN can access dashboard
  if (!user || !["EDITOR", "ADMIN"].includes(user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Left */}
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        {/* Header - Top */}
        <DashboardHeader />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
