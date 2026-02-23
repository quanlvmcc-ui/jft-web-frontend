import examApiRequest from "@/apiRequest/exam";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ExamType,
  SessionDetailType,
} from "@/schemaValidations/exam.schema";

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

export const useSessionDetailQuery = ({
  examId,
  sessionId,
}: {
  examId: string;
  sessionId: string;
}) => {
  return useQuery<SessionDetailType>({
    queryKey: ["sessionDetail", examId, sessionId],
    queryFn: () => examApiRequest.getSessionDetail(examId, sessionId),
    enabled: Boolean(examId) && Boolean(sessionId),
  });
};

export const useSaveAnswerMutation = (options?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: { questionId: string; selectedOptionId: string };
    }) => examApiRequest.saveSessionAnswer(sessionId, data),
    onSuccess: () => {
      // Refetch session detail để update UI với answer mới
      queryClient.invalidateQueries({ queryKey: ["sessionDetail"] });
      // ✅ Gọi callback từ component nếu có
      options?.onSuccess?.();
    },
    onError: () => {
      // ✅ Gọi error callback nếu có
      options?.onError?.();
    },
  });
};

export const useSubmitExamMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => examApiRequest.submitExam(examId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessionDetail"] });
      options?.onSuccess?.();
    },
  });
};

export function useExamResultQuery({
  examId,
  sessionId,
  enabled = true,
}: {
  examId: string;
  sessionId: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["examResult", examId, sessionId],
    queryFn: () => examApiRequest.getExamResult(examId, sessionId),
    enabled: enabled && !!examId && !!sessionId,
  });
}
