// src/lib/http.ts
import ky from "ky";

export const http = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include", // gửi cookie HttpOnly
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          // auth hết hạn / chưa login
          // xử lý ở tầng React Query / store
        }
      },
    ],
  },
});
