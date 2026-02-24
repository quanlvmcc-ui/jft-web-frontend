"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/layout/header";
import { AuthBootstrap } from "@/components/providers/auth-bootstrap";
import { useAuthStore } from "@/stores/auth.store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initialized, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // Debug: log cookies on mount
  useEffect(() => {
    console.log(
      "🔍 ProtectedLayout mounted. Cookies:",
      document.cookie || "(empty)"
    );
    console.log("🔍 Auth state:", { initialized, isAuthenticated, user });
  }, []);

  // 🔐 Guard: chỉ chạy SAU khi auth bootstrap xong
  useEffect(() => {
    console.log("🔍 Auth status changed:", { initialized, isAuthenticated, user });
    
    if (!initialized) {
      console.log("⏳ Auth not initialized yet, waiting...");
      return;
    }

    if (!isAuthenticated && user === null) {
      console.log("❌ Not authenticated, redirecting to login");
      router.replace("/login");
    } else {
      console.log("✅ Authenticated, allowing access");
    }
  }, [initialized, isAuthenticated, user, router]);

  return (
    <>
      <AuthBootstrap />
      {initialized && (
        <>
          <Header />
          {children}
        </>
      )}
    </>
  );
}
