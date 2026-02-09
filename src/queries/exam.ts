import examApiRequest from "@/apiRequest/exam";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ExamType } from "@/schemaValidations/exam.schema";

export const usePublishedExamQuery = ({ examId }: { examId: string }) => {
  return useQuery<ExamType>({
    queryKey: ["exam", examId],
    queryFn: () => examApiRequest.getPublishedExam(examId),
    enabled: Boolean(examId),
  });
};

export const useStartSessionMutation = () => {
  return useMutation({
    mutationFn: (examId: string) => examApiRequest.startSession(examId),
  });
};
