import { z } from "zod";
import { SECTION_TYPES, QUESTION_STATUSES } from "@/types/enums";

/* ======================================================
 * SHARED SCHEMAS
 * ====================================================== */

/**
 * Option (nested trong Question)
 */
export const QuestionOptionSchema = z.object({
  id: z.string().uuid(),
  questionId: z.string().uuid(),
  contentHtml: z.string(),
  isCorrect: z.boolean(),
  orderNo: z.number().int().nonnegative(),
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

/**
 * Creator info (nested trong Question)
 */
export const CreatorSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().nullable(),
  email: z.string().email(),
});

export type Creator = z.infer<typeof CreatorSchema>;

/**
 * Creator info trong list response (backend không trả email)
 */
export const CreatorSummarySchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().nullable(),
});

export type CreatorSummary = z.infer<typeof CreatorSummarySchema>;

/**
 * Full Question model (Response)
 */
export const QuestionSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    sectionType: z.enum([
      SECTION_TYPES.SCRIPT_VOCABULARY,
      SECTION_TYPES.CONVERSATION_EXPRESSION,
      SECTION_TYPES.LISTENING,
      SECTION_TYPES.READING,
    ]),
    contentHtml: z.string(),
    explanationHtml: z.string().nullable().optional(),
    status: z.enum([QUESTION_STATUSES.DRAFT, QUESTION_STATUSES.ACTIVE]),
    createdBy: z.string().uuid(),
    creator: CreatorSchema.optional(),
    options: z.array(QuestionOptionSchema).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable().optional(),
  })
  .strict();

export type Question = z.infer<typeof QuestionSchema>;

/**
 * Question item cho list response
 * Lưu ý: creator chỉ có id + displayName
 */
export const QuestionListItemSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    sectionType: z.enum([
      SECTION_TYPES.SCRIPT_VOCABULARY,
      SECTION_TYPES.CONVERSATION_EXPRESSION,
      SECTION_TYPES.LISTENING,
      SECTION_TYPES.READING,
    ]),
    contentHtml: z.string(),
    explanationHtml: z.string().nullable().optional(),
    status: z.enum([QUESTION_STATUSES.DRAFT, QUESTION_STATUSES.ACTIVE]),
    createdBy: z.string().uuid(),
    creator: CreatorSummarySchema.optional(),
    options: z.array(QuestionOptionSchema).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable().optional(),
  })
  .strict();

export type QuestionListItem = z.infer<typeof QuestionListItemSchema>;

/* ======================================================
 * LIST QUESTIONS - GET /questions
 * ====================================================== */

/**
 * Query filters
 * VD: GET /questions?page=1&limit=20&sectionType=LISTENING&keyword=capital
 */
export const ListQuestionsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sectionType: z
      .enum([
        SECTION_TYPES.SCRIPT_VOCABULARY,
        SECTION_TYPES.CONVERSATION_EXPRESSION,
        SECTION_TYPES.LISTENING,
        SECTION_TYPES.READING,
      ])
      .optional(),
    keyword: z.string().optional(),
    sort: z.string().default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();

export type ListQuestionsQuery = z.infer<typeof ListQuestionsQuerySchema>;

/**
 * Pagination info
 */
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Response: List questions
 */
export const ListQuestionsResponseSchema = z
  .object({
    data: z.array(QuestionListItemSchema),
    pagination: PaginationSchema,
  })
  .strict();

export type ListQuestionsResponse = z.infer<typeof ListQuestionsResponseSchema>;

/* ======================================================
 * CREATE QUESTION - POST /questions
 * ====================================================== */

/**
 * Request body: Create question
 */
export const CreateQuestionOptionBodySchema = z.object({
  contentHtml: z.string().min(1),
  isCorrect: z.boolean(),
  orderNo: z.number().int().nonnegative(),
});

export type CreateQuestionOptionBody = z.infer<
  typeof CreateQuestionOptionBodySchema
>;

export const CreateQuestionBodySchema = z
  .object({
    title: z.string().min(1),
    sectionType: z.enum([
      SECTION_TYPES.SCRIPT_VOCABULARY,
      SECTION_TYPES.CONVERSATION_EXPRESSION,
      SECTION_TYPES.LISTENING,
      SECTION_TYPES.READING,
    ]),
    contentHtml: z.string().min(1),
    explanationHtml: z.string().optional(),
    options: z.array(CreateQuestionOptionBodySchema).min(1),
  })
  .strict();

export type CreateQuestionBody = z.infer<typeof CreateQuestionBodySchema>;

/**
 * Response: Created question
 */
export const CreateQuestionResponseSchema = QuestionSchema;

export type CreateQuestionResponse = z.infer<
  typeof CreateQuestionResponseSchema
>;

/* ======================================================
 * UPDATE QUESTION - PATCH /questions/:id
 * ====================================================== */

/**
 * Request body: Update question (partial)
 */
export const UpdateQuestionBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    sectionType: z
      .enum([
        SECTION_TYPES.SCRIPT_VOCABULARY,
        SECTION_TYPES.CONVERSATION_EXPRESSION,
        SECTION_TYPES.LISTENING,
        SECTION_TYPES.READING,
      ])
      .optional(),
    contentHtml: z.string().min(1).optional(),
    explanationHtml: z.string().optional(),
    options: z.array(CreateQuestionOptionBodySchema).optional(),
  })
  .strict();

export type UpdateQuestionBody = z.infer<typeof UpdateQuestionBodySchema>;

/**
 * Response: Updated question
 */
export const UpdateQuestionResponseSchema = QuestionSchema;

export type UpdateQuestionResponse = z.infer<
  typeof UpdateQuestionResponseSchema
>;

/* ======================================================
 * GET QUESTION DETAIL - GET /questions/:id
 * ====================================================== */

/**
 * Response: Single question detail
 */
export const GetQuestionResponseSchema = QuestionSchema;

export type GetQuestionResponse = z.infer<typeof GetQuestionResponseSchema>;

/* ======================================================
 * DELETE QUESTION - DELETE /questions/:id
 * ====================================================== */

/**
 * Response: Deleted question (soft delete - set deletedAt)
 */
export const DeleteQuestionResponseSchema = QuestionSchema;

export type DeleteQuestionResponse = z.infer<
  typeof DeleteQuestionResponseSchema
>;

/* ======================================================
 * DUPLICATE QUESTION - POST /questions/:id/duplicate
 * ====================================================== */

/**
 * Response: Duplicated question (new copy)
 */
export const DuplicateQuestionResponseSchema = QuestionSchema;

export type DuplicateQuestionResponse = z.infer<
  typeof DuplicateQuestionResponseSchema
>;

/* ======================================================
 * CHECK QUESTION USAGE - GET /questions/:id/usage
 * ====================================================== */

/**
 * Response: Question usage in exams
 */
export const QuestionUsageResponseSchema = z
  .object({
    isUsed: z.boolean(),
    count: z.number().nonnegative(),
    exams: z.array(
      z.object({
        examId: z.string().uuid(),
        examTitle: z.string(),
      }),
    ),
  })
  .strict();

export type QuestionUsageResponse = z.infer<typeof QuestionUsageResponseSchema>;

/* ======================================================
 * BULK DELETE QUESTIONS - DELETE /questions/bulk
 * ====================================================== */

/**
 * Request body: Bulk delete
 */
export const BulkDeleteQuestionsBodySchema = z
  .object({
    ids: z.array(z.string().uuid()).min(1),
  })
  .strict();

export type BulkDeleteQuestionsBody = z.infer<
  typeof BulkDeleteQuestionsBodySchema
>;

/**
 * Response: Bulk delete result
 */
export const BulkDeleteQuestionsResponseSchema = z
  .object({
    deleted: z.number(),
  })
  .strict();

export type BulkDeleteQuestionsResponse = z.infer<
  typeof BulkDeleteQuestionsResponseSchema
>;

/* ======================================================
 * BULK RESTORE QUESTIONS - PATCH /questions/bulk/restore
 * ====================================================== */

/**
 * Response: Bulk restore result
 */
export const BulkRestoreQuestionsResponseSchema = z
  .object({
    restored: z.number(),
  })
  .strict();

export type BulkRestoreQuestionsResponse = z.infer<
  typeof BulkRestoreQuestionsResponseSchema
>;
