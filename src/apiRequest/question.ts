import { http } from "@/lib/http";
import type {
  BulkDeleteQuestionsBody,
  BulkDeleteQuestionsResponse,
  BulkRestoreQuestionsResponse,
  CreateQuestionBody,
  CreateQuestionResponse,
  DeleteQuestionResponse,
  DuplicateQuestionResponse,
  GetQuestionResponse,
  ListQuestionsQuery,
  ListQuestionsResponse,
  QuestionUsageResponse,
  UpdateQuestionBody,
  UpdateQuestionResponse,
} from "@/schemaValidations/question.schema";

const prefix = "questions";

const toSearchParams = (query: Partial<ListQuestionsQuery> = {}) => {
  const params = new URLSearchParams();

  (Object.keys(query) as Array<keyof ListQuestionsQuery>).forEach((key) => {
    const value = query[key];
    if (value === undefined || value === null || value === "") return;
    params.set(String(key), String(value));
  });

  return params;
};

const questionApiRequest = {
  getQuestions: (query: Partial<ListQuestionsQuery> = {}) =>
    http
      .get(prefix, { searchParams: toSearchParams(query) })
      .json<ListQuestionsResponse>(),

  getQuestion: (questionId: string) =>
    http.get(`${prefix}/${questionId}`).json<GetQuestionResponse>(),
  createQuestion: (body: CreateQuestionBody) =>
    http.post(prefix, { json: body }).json<CreateQuestionResponse>(),

  updateQuestion: (questionId: string, body: UpdateQuestionBody) =>
    http
      .patch(`${prefix}/${questionId}`, { json: body })
      .json<UpdateQuestionResponse>(),

  deleteQuestion: (questionId: string) =>
    http.delete(`${prefix}/${questionId}`).json<DeleteQuestionResponse>(),

  restoreQuestion: (questionId: string) =>
    http
      .patch(`${prefix}/${questionId}/restore`)
      .json<UpdateQuestionResponse>(),

  duplicateQuestion: (questionId: string) =>
    http
      .post(`${prefix}/${questionId}/duplicate`)
      .json<DuplicateQuestionResponse>(),

  checkQuestionUsage: (questionId: string) =>
    http.get(`${prefix}/${questionId}/usage`).json<QuestionUsageResponse>(),

  bulkDeleteQuestions: (body: BulkDeleteQuestionsBody) =>
    http
      .delete(`${prefix}/bulk`, { json: body })
      .json<BulkDeleteQuestionsResponse>(),

  bulkRestoreQuestions: (body: BulkDeleteQuestionsBody) =>
    http
      .patch(`${prefix}/bulk/restore`, { json: body })
      .json<BulkRestoreQuestionsResponse>(),
};

export default questionApiRequest;
