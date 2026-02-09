import { z } from "zod";

export const ExamStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const ExamSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  timeLimit: z.number(),
  status: ExamStatusSchema,
});

export type ExamType = z.TypeOf<typeof ExamSchema>;

export const ExamSessionStatus = z.enum(["IN_PROGRESS", "SUBMITTED"]);

export const ExamSessionSchema = z.object({
  id: z.string(),
  examId: z.string(),
  userId: z.string(),
  status: ExamSessionStatus,
  startTime: z.string().datetime(),
  timeLimit: z.number(),
  totalCorrect: z.number().nullable(),
  totalWrong: z.number().nullable(),
  totalUnanswered: z.number().nullable(),
  submittedAt: z.string().datetime().nullable(),
  deletedAt: z.string().datetime().nullable(),
});

export type ExamSessionType = z.TypeOf<typeof ExamSessionSchema>;
