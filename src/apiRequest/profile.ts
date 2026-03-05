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
};

export default profileApiRequest;
