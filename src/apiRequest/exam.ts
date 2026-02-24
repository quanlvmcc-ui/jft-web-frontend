import { http } from "@/lib/http";
import type {
  ExamResultType,
  ExamSessionType,
  ExamType,
  SaveAnswerResponseType,
  SessionDetailType,
  SubmitExamResponseType,
} from "@/schemaValidations/exam.schema";

const prefix = "exams/";

const examApiRequest = {
  getExams: () => http.get(prefix).json<ExamType[]>(),

  getPublishedExam: (examId: string) =>
    http.get(`${prefix}${examId}`).json<ExamType>(),

  startSession: (examId: string) =>
    http.post(`${prefix}${examId}/sessions`).json<ExamSessionType>(),

  getSessionDetail: (examId: string, sessionId: string) =>
    http
      .get(`${prefix}${examId}/sessions/${sessionId}`)
      .json<SessionDetailType>(),

  saveSessionAnswer: (
    sessionId: string,
    data: {
      questionId: string;
      selectedOptionId: string;
    },
  ) =>
    http
      .put(`${prefix}sessions/${sessionId}/answers`, { json: data })
      .json<SaveAnswerResponseType>(),

  submitExam: (examId: string) =>
    http.post(`${prefix}${examId}/submit`).json<SubmitExamResponseType>(),

  getExamResult: (examId: string, sessionId: string) =>
    http
      .get(`${prefix}${examId}/sessions/${sessionId}/result`)
      .json<ExamResultType>(),
};

export default examApiRequest;
