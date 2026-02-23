"use client";

import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import {
  useSaveAnswerMutation,
  useSessionDetailQuery,
  useSubmitExamMutation,
} from "@/queries/exam";
import { useParams, useRouter } from "next/navigation";
import { useTimer } from "@/hooks/useTimer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/use-toast";
import { SkeletonLayout } from "@/components/ui/skeleton-layout";
import { QuestionNavigationSidebar } from "@/components/ui/question-navigation-sidebar";

export default function ExamSessionPage() {
  const params = useParams<{ id: string; sessionId: string }>();
  const router = useRouter();
  const examId = params?.id ?? "";
  const sessionId = params?.sessionId ?? "";
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useSessionDetailQuery({
    examId,
    sessionId,
  });

  /**
   * 🎓 STATE QUẢN LÝ DIALOG
   * Kiến thức: React useState hook
   * - showConfirmDialog: boolean state
   * - setShowConfirmDialog: function để update state
   */
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  /**
   * 🎓 REFS ARRAY ĐỂ SCROLL ĐẾN CÂU HỎI
   * Kiến thức: useRef để reference DOM elements
   * - questionRefs: array của refs, 1 cho mỗi question
   * - Dùng để gọi scrollIntoView() khi user click sidebar
   */
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * 🎓 DEBOUNCE TIMER REF
   * Kiến thức: useRef cho setTimeout ID
   * - debounceTimerRef: store setTimeout ID
   * - Dùng để clearTimeout khi user click lại trước khi delay expire
   * - Pattern: Delay API call 500ms, reset khi user click lại
   */
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingAnswerRef = useRef<{
    questionId: string;
    selectedOptionId: string;
  } | null>(null);

  /**
   * 🎓 STATE QUẢN LÝ CÂU HỎI HIỆN TẠI
   * Kiến thức: useState
   * - currentQuestionIndex: index của câu hiện tại (0-based)
   * - setCurrentQuestionIndex: update khi user click sidebar
   */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const submitMutation = useSubmitExamMutation({
    onSuccess: () => {
      // Redirect to result page after submit
      router.push(`/exam/${examId}/session/${sessionId}/result`);
    },
  });

  /**
   * 🎓 TÍNH TOÁN THỐNG KÊ CÂU HỎI
   * Kiến thức: useMemo - chỉ tính lại khi data thay đổi
   * Tránh tính lại mỗi lần component re-render
   */
  const questionStats = useMemo(() => {
    if (!data) return { answered: 0, unanswered: 0, total: 0 };

    const answered = data.questions.filter(
      (q) => q.selectedOptionId !== null,
    ).length;
    const total = data.questions.length;
    const unanswered = total - answered;

    return { answered, unanswered, total };
  }, [data]); // ← dependency: chỉ chạy lại khi data thay đổi

  /**
   * 🎓 HANDLER KHI CLICK NÚT "NỘP BÀI"
   * Flow: Click button → Mở dialog thay vì submit ngay
   */
  const handleSubmitClick = () => {
    setShowConfirmDialog(true); // Mở dialog
  };

  /**
   * 🎓 HANDLER CHUYỂN CÂU HỎI + SCROLL
   * Flow: User click Q1, Q2... trong sidebar → Update currentQuestionIndex → Scroll to question
   */
  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    // Scroll to selected question with smooth behavior
    setTimeout(() => {
      questionRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start", // Align to top of viewport
      });
    }, 50); // Small delay để ensure ref is set
  };

  /**
   * 🎓 EFFECT: AUTO-SCROLL KHI CURRENT QUESTION CHANGE
   * Safety net nếu handleSelectQuestion scroll bị fail
   */
  useEffect(() => {
    if (data && currentQuestionIndex < data.questions.length) {
      setTimeout(() => {
        questionRefs.current[currentQuestionIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [currentQuestionIndex, data]);

  /**
   * 🎓 CLEANUP EFFECT: CLEAR DEBOUNCE TIMER KHI UNMOUNT
   * Kiến thức: Cleanup function prevent memory leak
   * - Return function chạy trước khi component unmount hoặc dependency change
   * - Gọi clearTimeout để hủy pending API call
   * - Prevent stale closure: Luôn clean up timers/listeners
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * 🎓 HANDLER KHI XÁC NHẬN TRONG DIALOG
   * Flow: User click "Xác nhận" trong dialog → Thực sự submit
   */
  const handleConfirmSubmit = () => {
    submitMutation.mutate(examId); // Submit API
    // Không cần setShowConfirmDialog(false) vì sẽ redirect
  };

  /**
   * 🎓 HANDLER KHI HỦY TRONG DIALOG
   * Flow: User click "Hủy" hoặc click backdrop → Đóng dialog
   */
  const handleCancelSubmit = () => {
    setShowConfirmDialog(false); // Đóng dialog
  };

  const handleTimeExpired = useCallback(() => {
    submitMutation.mutate(examId);
  }, [examId, submitMutation]);

  const { displayTime, percentage, isExpired, isWarning } = useTimer({
    startTime: data?.startTime ?? "",
    timeLimit: data?.timeLimit ?? 0,
    onExpired: handleTimeExpired,
  });

  const saveAnswerMutation = useSaveAnswerMutation({
    onSuccess: () => {
      toast({
        description: "Đã lưu đáp án",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu đáp án",
      });
    },
  });

  /**
   * 🎓 HANDLER OPTION CHANGE VỚI DEBOUNCE
   * Kiến thức: Debounce pattern để giảm API calls
   *
   * Vấn đề: User click 3 option liên tiếp = 3 API calls
   * Giải pháp: Delay 500ms, nếu user click lại thì reset timer
   *
   * Timeline:
   * - Click Q1 option A → Timer start 500ms
   * - Click Q1 option B (300ms) → Clear timer, reset 500ms
   * - Click Q1 option C (400ms) → Clear timer, reset 500ms
   * - (wait 500ms) → API call chỉ 1 lần với option C
   *
   * Result: 3 clicks → 1 API call (75% reduction)
   */
  const handeSelectOption = (questionId: string, selectedOptionId: string) => {
    // Lưu answer tạm thời vào ref
    pendingAnswerRef.current = { questionId, selectedOptionId };

    // Nếu đã có timer, hủy nó (reset)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set timer mới: Delay 500ms before call API
    debounceTimerRef.current = setTimeout(() => {
      // Kiểm tra pending answer vẫn tồn tại
      if (pendingAnswerRef.current) {
        const { questionId, selectedOptionId } = pendingAnswerRef.current;
        saveAnswerMutation.mutate({
          sessionId,
          data: { questionId, selectedOptionId },
        });
      }
    }, 500);
  };

  /**
   * 🎓 LOADING STATE VỚI SKELETON LAYOUT
   * Pattern: Conditional rendering based on data state
   *
   * Kiến thức:
   * 1. isLoading → Hiển thị skeleton loading layout
   * 2. isError → Hiển thị error message
   * 3. !data → Hiển thị fallback message
   * 4. data → Hiển thị actual content
   */
  if (isLoading) return <SkeletonLayout />;
  if (isError)
    return <div className="p-6 text-red-600">Lỗi: {String(error)}</div>;
  if (!data) return <div className="p-6">Không có dữ liệu...</div>;

  // Prepare sidebar data
  const sidebarQuestions = data.questions.map((q) => ({
    id: q.questionId,
    questionNumber: q.order,
    selectedOptionId: q.selectedOptionId,
  }));

  return (
    <div className="h-screen flex bg-gray-50">
      {/* ═══ QUESTION NAVIGATION SIDEBAR ═══ */}
      {/* Desktop only - hidden on mobile */}
      <div className="hidden lg:block flex-shrink-0">
        <QuestionNavigationSidebar
          questions={sidebarQuestions}
          currentQuestionIndex={currentQuestionIndex}
          onSelectQuestion={handleSelectQuestion}
        />
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col">
        {/* ─── TIMER HEADER (Fixed Top) ─── */}
        <div className="bg-white border-b sticky top-0 z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            {/* Timer Display */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Thời gian còn lại:</span>
              <div
                className={`text-3xl font-bold font-mono ${
                  isExpired
                    ? "text-red-600"
                    : isWarning
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {displayTime}
              </div>
            </div>

            {/* Question Count + Current Progress */}
            <div className="text-sm text-gray-600">
              Câu {currentQuestionIndex + 1} / {data.questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isExpired
                  ? "bg-red-600"
                  : isWarning
                    ? "bg-yellow-600"
                    : "bg-green-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* ═══ SINGLE QUESTION DISPLAY ═══ */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
          {(() => {
            const q = data.questions[currentQuestionIndex];
            return (
              <div className="bg-white border rounded-lg p-8 shadow-md max-w-2xl mx-auto w-full">
                {/* 🎓 QUESTION HEADER */}
                <div className="mb-6 pb-4 border-b">
                  <h2 className="text-xl text-gray-500 font-medium mb-3">
                    Câu {q.order}
                  </h2>
                  <h3 className="text-2xl font-bold text-gray-800">
                    <span dangerouslySetInnerHTML={{ __html: q.contentHtml }} />
                  </h3>
                </div>

                {/* 🎓 QUESTION OPTIONS */}
                <div className="space-y-4">
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center space-x-4 cursor-pointer p-4 rounded-lg border-2 transition-all ${
                        q.selectedOptionId === opt.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.questionId}`}
                        value={opt.id}
                        checked={q.selectedOptionId === opt.id}
                        onChange={() => handeSelectOption(q.questionId, opt.id)}
                        className="flex-shrink-0 w-5 h-5 cursor-pointer"
                      />
                      <span
                        className="text-lg text-gray-700"
                        dangerouslySetInnerHTML={{ __html: opt.contentHtml }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ═══ NAVIGATION & SUBMIT (Fixed Bottom) ═══ */}
        <div className="bg-white border-t p-4 flex justify-center items-center gap-3 sticky bottom-0">
          {/* 🎓 PREVIOUS BUTTON */}
          <button
            onClick={() => handleSelectQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700 active:scale-95"
            }`}
          >
            ← Câu trước
          </button>

          {/* 🎓 SUBMIT BUTTON */}
          <button
            onClick={handleSubmitClick}
            disabled={submitMutation.isPending || isLoading}
            className={`px-8 py-2 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg text-sm ${
              submitMutation.isPending || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {submitMutation.isPending ? "⏳ Đang nộp..." : "✓ Nộp bài"}
          </button>

          {/* 🎓 NEXT BUTTON */}
          <button
            onClick={() => handleSelectQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === data.questions.length - 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              currentQuestionIndex === data.questions.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
            }`}
          >
            Câu sau →
          </button>
        </div>

        {/**
         * 🎓 THÊM CONFIRM DIALOG
         * - Render ở cuối component (outside main layout)
         * - Dialog sẽ overlay lên toàn bộ màn hình
         * - Position: fixed trong component
         */}
        <ConfirmDialog
          open={showConfirmDialog}
          title="Xác nhận nộp bài"
          message="Bạn có chắc chắn muốn nộp bài? Bạn sẽ không thể thay đổi câu trả lời sau khi nộp."
          confirmText="Nộp bài"
          cancelText="Kiểm tra lại"
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelSubmit}
          loading={submitMutation.isPending}
          stats={questionStats}
        />
      </div>
    </div>
  );
}
