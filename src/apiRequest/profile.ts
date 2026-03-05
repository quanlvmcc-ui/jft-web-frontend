import { http } from "@/lib/http";
import {
  ChangePasswordBodyType,
  ExamHistoryItemResponseType,
  UpdateProfileBodyType,
  UserProfileResponseType,
} from "@/schemaValidations/profile.schema";

const prefix = "users/me";

const profileApiRequest = {
  getUserProfile: () => http.get(prefix).json<UserProfileResponseType>(),

  updateProfile: (updateProfileBody: UpdateProfileBodyType) =>
    http
      .patch(prefix, { json: updateProfileBody })
      .json<UserProfileResponseType>(),

  changePassword: (changePasswordBodyType: ChangePasswordBodyType) =>
    http
      .post(`${prefix}/change-password`, { json: changePasswordBodyType })
      .json<{ message: string }>(),

  getExamHistory: () =>
    http.get(`${prefix}/exam-history`).json<ExamHistoryItemResponseType[]>(),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Build URL đúng: remove trailing slash từ API_URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    const endpoint = `${apiUrl}/${prefix}/avatar`;

    // KHÔNG dùng http client mặc định vì nó force Content-Type: application/json
    // Dùng native fetch để browser tự set Content-Type với boundary đúng
    return fetch(endpoint, {
      method: "POST",
      body: formData,
      credentials: "include", // Gửi cookie
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Upload failed");
      }
      return res.json() as Promise<{
        avatarUrl: string;
        filename: string;
        uploadedAt: string;
      }>;
    });
  },
};

export default profileApiRequest;
