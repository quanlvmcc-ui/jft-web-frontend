/**
 * Convert relative avatar URL thành absolute URL
 * Handle cho cả avatarUrl cũ (relative) và mới (absolute)
 */
export function getAbsoluteAvatarUrl(
  avatarUrl: string | null | undefined,
): string | undefined {
  if (!avatarUrl) return undefined;

  // Nếu đã là absolute URL (bắt đầu bằng http/https)
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  // Nếu là relative URL, convert thành absolute với backend URL
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // Remove trailing slash từ backend URL
  const baseUrl = backendUrl.replace(/\/$/, "");

  // Thêm leading slash nếu avatarUrl chưa có
  const path = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;

  return `${baseUrl}${path}`;
}
