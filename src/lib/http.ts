// src/lib/http.ts
import ky from "ky";

// Assign environment variable to constant at module level for proper static inlining
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

// Biến cờ để kiểm soát việc refresh token chỉ thực hiện một lần tại một thời điểm
let isRefreshing = false;
// Biến lưu promise của request refresh token, giúp các request khác chờ kết quả refresh
let refreshPromise: Promise<Response> | null = null;

export const http = ky.create({
  // Tiền tố URL cho tất cả request, lấy từ biến môi trường
  prefixUrl: API_URL,
  // Gửi cookie HttpOnly cùng request (dùng cho xác thực)
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    afterResponse: [
      /**
       * Xử lý sau khi nhận response:
       * - Nếu response không phải 401 (Unauthorized) thì trả về bình thường.
       * - Nếu là 401, kiểm tra có phải đang gọi refresh token không (tránh lặp vô hạn).
       * - Nếu chưa refresh, thực hiện refresh token và lưu promise lại để các request khác chờ.
       * - Sau khi refresh thành công, thử gửi lại request ban đầu.
       * - Nếu refresh thất bại, trả về response lỗi để tầng trên xử lý (ví dụ: logout).
       */
      async (request, options, response) => {
        // Nếu không phải lỗi 401 thì trả về response luôn
        if (response.status !== 401) {
          return response;
        }

        // Nếu đang gọi refresh token thì không xử lý tiếp để tránh lặp vô hạn
        if (request.url.includes("/auth/refresh")) return response;

        // Nếu chưa có request refresh nào đang chạy, thực hiện refresh và lưu lại promise
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = http.post("auth/refresh");
        }

        try {
          // Chờ kết quả refresh token
          const refreshResponse = await refreshPromise;
          if (!refreshResponse?.ok) {
            throw new Error("Failed to refresh token");
          }

          return http(request, options); // retry
        } catch {
          // Nếu refresh thất bại, trả về response lỗi để tầng trên xử lý (ví dụ: logout)
          return response;
        } finally {
          // Reset trạng thái refresh
          isRefreshing = false;
          refreshPromise = null;
        }
      },
    ],
  },
});
