import { http } from "@/lib/http";
import type { ExamType } from "@/schemaValidations/exam.schema";

const prefix = "exams/";

const examApiRequest = {
  getPublishedExam: (examId: string) =>
    http.get(`${prefix}${examId}`).json<ExamType>(),
};

export default examApiRequest;
