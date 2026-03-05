import { z } from "zod";

export const UpdateProfileBody = z
  .object({
    displayName: z.string().max(50).optional(),
    phoneNumber: z.string().max(20).optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().optional(),
  })
  .strict();

export type UpdateProfileBodyType = z.TypeOf<typeof UpdateProfileBody>;

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string(),
  })
  .strict();

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;

export const UserProfileResponse = z
  .object({
    id: z.string(),
    email: z.string(),
    role: z.enum(["USER", "EDITOR", "ADMIN"]),
    displayName: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    bio: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export type UserProfileResponseType = z.TypeOf<typeof UserProfileResponse>;

export const ExamHistoryItemResponse = z
  .object({
    id: z.string(),
    examId: z.string(),
    examTitle: z.string(),
    score: z.number(), // số câu trả lời đúng
    totalQuestions: z.number(), // tổng câu hỏi
    correctAnswers: z.number(), // số câu đúng
    percentage: z.number(), // phần trăm: 0-100
    submittedAt: z.string().datetime(),
    timeTaken: z.number(), // giây
  })
  .strict();
  .strict();

export type ExamHistoryItemResponseType = z.TypeOf<
  typeof ExamHistoryItemResponse
>;
