import { z } from "zod";

export const ExamStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const ExamSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  timeLimit: z.number(), // GIÂY (seconds) - ví dụ: 1800 = 30 phút
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
  timeLimit: z.number(), // GIÂY (seconds)
  totalCorrect: z.number().nullable(),
  totalWrong: z.number().nullable(),
  totalUnanswered: z.number().nullable(),
  submittedAt: z.string().datetime().nullable(),
  deletedAt: z.string().datetime().nullable(),
});

export type ExamSessionType = z.TypeOf<typeof ExamSessionSchema>;

export const OptionSchema = z.object({
  id: z.string(),
  contentHtml: z.string(), // sửa từ text → contentHtml
});

export type OptionType = z.TypeOf<typeof OptionSchema>;

export const QuestionWithAnswerSchema = z.object({
  questionId: z.string(), // sửa từ id → questionId
  order: z.number(), // sửa từ questionNumber → order
  contentHtml: z.string(), // sửa từ text → contentHtml
  selectedOptionId: z.string().nullable(),
  answeredAt: z.string().datetime().nullable(),
  options: z.array(OptionSchema),
});

export type QuestionWithAnswerType = z.TypeOf<typeof QuestionWithAnswerSchema>;

export const SessionDetailSchema = z.object({
  sessionId: z.string(),
  examId: z.string(),
  status: z.string(),
  startTime: z.string().datetime(),
  timeLimit: z.number(), // GIÂY (seconds)
  createdAt: z.string().datetime(),
  submittedAt: z.string().datetime().nullable(),
  questions: z.array(QuestionWithAnswerSchema),
});

export type SessionDetailType = z.TypeOf<typeof SessionDetailSchema>;

export const SaveAnswerResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  questionId: z.string(),
  selectedOptionId: z.string(),
  answeredAt: z.string().datetime(),
  isCorrect: z.boolean().nullable(),
  questionSnapshotHtml: z.string().nullable(),
  optionsSnapshotJson: z.string().nullable(),
  correctOptionId: z.string().nullable(),
});

export type SaveAnswerResponseType = z.infer<typeof SaveAnswerResponseSchema>;

export const SubmitExamResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  examId: z.string(),
  status: ExamSessionStatus,
  startTime: z.string().datetime(),
  timeLimit: z.number(), // GIÂY (seconds)
  totalCorrect: z.number().nullable(),
  totalWrong: z.number().nullable(),
  totalUnanswered: z.number().nullable(),
  submittedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

export type SubmitExamResponseType = z.infer<typeof SubmitExamResponseSchema>;

// ResultOptionSchema - option với flag isCorrect
export const ResultOptionSchema = z.object({
  id: z.string(),
  contentHtml: z.string(),
  isCorrect: z.boolean(),
});

// ResultQuestionSchema - câu hỏi + kết quả (selectedOptionId, correctOptionId, isCorrect)
export const ResultQuestionSchema = z.object({
  questionId: z.string(),
  order: z.number(),
  contentHtml: z.string(),
  selectedOptionId: z.string().nullable(),
  correctOptionId: z.string().nullable(), // ← có thể null nếu chưa submit
  isCorrect: z.boolean().nullable(),
  options: z.array(ResultOptionSchema),
});

// ExamResultSchema - response từ API result
export const ExamResultSchema = z.object({
  sessionId: z.string(),
  examId: z.string(),
  status: z.literal("SUBMITTED"),
  submittedAt: z.string().datetime(),
  startTime: z.string().datetime(),
  timeLimit: z.number(), // GIÂY (seconds)
  totalCorrect: z.number(),
  totalWrong: z.number(),
  totalUnanswered: z.number(),
  questions: z.array(ResultQuestionSchema),
});

export type ExamResultType = z.infer<typeof ExamResultSchema>;
