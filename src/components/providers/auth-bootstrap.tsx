// src/components/providers/auth-bootstrap.tsx
"use client";

// Mục đích: component này chịu trách nhiệm 'bootstrap' (khởi động) xác thực phía client.
// Khi được render (thường ở mức cao như trong `layout`), nó sẽ gọi hook `useMe`
// để tải thông tin người dùng hiện tại và cập nhật store xác thực toàn cục.
// Lưu ý: component không render UI — nó chỉ thực hiện side-effect (gọi hook).
import { useMe } from "@/hooks/useMe";

export function AuthBootstrap() {
  // Gọi `useMe()` để fetch trạng thái người dùng và thiết lập vào `useAuthStore`.
  // Trả về `null` vì không cần hiển thị gì.
  useMe();
  return null;
}
