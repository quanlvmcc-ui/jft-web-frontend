import questionApiRequest from "@/apiRequest/question";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BulkDeleteQuestionsBody,
  CreateQuestionBody,
  DuplicateQuestionResponse,
  GetQuestionResponse,
  ListQuestionsQuery,
  ListQuestionsResponse,
  UpdateQuestionBody,
  UpdateQuestionResponse,
} from "@/schemaValidations/question.schema";

const QUESTIONS_QUERY_KEY = "questions";
const QUESTION_LIST_QUERY_KEY = "list";
const QUESTION_DETAIL_QUERY_KEY = "detail";

export const useQuestionsQuery = (
  query: Partial<ListQuestionsQuery> = {},
  options?: { enabled?: boolean },
) => {
  return useQuery<ListQuestionsResponse>({
    queryKey: [QUESTIONS_QUERY_KEY, QUESTION_LIST_QUERY_KEY, query],
    queryFn: () => questionApiRequest.getQuestions(query),
    enabled: options?.enabled ?? true,
  });
};

export const useQuestionDetailQuery = (questionId: string) => {
  return useQuery<GetQuestionResponse>({
    queryKey: [QUESTIONS_QUERY_KEY, QUESTION_DETAIL_QUERY_KEY, questionId],
    queryFn: () => questionApiRequest.getQuestion(questionId),
    enabled: Boolean(questionId),
  });
};

export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createQuestionBody: CreateQuestionBody) =>
      questionApiRequest.createQuestion(createQuestionBody),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUESTIONS_QUERY_KEY, QUESTION_LIST_QUERY_KEY],
      });
    },
  });
};

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      updateQuestionBody,
    }: {
      questionId: string;
      updateQuestionBody: UpdateQuestionBody;
    }) => questionApiRequest.updateQuestion(questionId, updateQuestionBody),
    onSuccess: (updatedQuestion: UpdateQuestionResponse) => {
      queryClient.setQueryData(
        [QUESTIONS_QUERY_KEY, QUESTION_DETAIL_QUERY_KEY, updatedQuestion.id],
        updatedQuestion,
      );
      queryClient.invalidateQueries({
        queryKey: [QUESTIONS_QUERY_KEY, QUESTION_LIST_QUERY_KEY],
      });
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) =>
      questionApiRequest.deleteQuestion(questionId),
    onSuccess: (_deletedQuestion, questionId: string) => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
      queryClient.removeQueries({
        queryKey: [QUESTIONS_QUERY_KEY, QUESTION_DETAIL_QUERY_KEY, questionId],
      });
    },
  });
};

export const useRestoreQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) =>
      questionApiRequest.restoreQuestion(questionId),
    onSuccess: (restoredQuestion: UpdateQuestionResponse) => {
      queryClient.setQueryData(
        [QUESTIONS_QUERY_KEY, QUESTION_DETAIL_QUERY_KEY, restoredQuestion.id],
        restoredQuestion,
      );
      queryClient.invalidateQueries({
        queryKey: [QUESTIONS_QUERY_KEY, QUESTION_LIST_QUERY_KEY],
      });
    },
  });
};

export const useDuplicateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) =>
      questionApiRequest.duplicateQuestion(questionId),
    onSuccess: (newQuestion: DuplicateQuestionResponse) => {
      queryClient.invalidateQueries({
        queryKey: [QUESTIONS_QUERY_KEY, QUESTION_LIST_QUERY_KEY],
      });
      queryClient.setQueryData(
        [QUESTIONS_QUERY_KEY, QUESTION_DETAIL_QUERY_KEY, newQuestion.id],
        newQuestion,
      );
    },
  });
};

export const useCheckQuestionUsageMutation = () => {
  return useMutation({
    mutationFn: (questionId: string) =>
      questionApiRequest.checkQuestionUsage(questionId),
  });
};

export const useBulkDeleteQuestionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bulkDeleteQuestionsBody: BulkDeleteQuestionsBody) =>
      questionApiRequest.bulkDeleteQuestions(bulkDeleteQuestionsBody),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
  });
};

export const useBulkRestoreQuestionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bulkRestoreQuestionsBody: BulkDeleteQuestionsBody) =>
      questionApiRequest.bulkRestoreQuestions(bulkRestoreQuestionsBody),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    },
  });
};
