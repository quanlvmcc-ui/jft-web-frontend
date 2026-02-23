"use client";

import { useCallback, useState, useMemo } from "react";
import {
  useSaveAnswerMutation,
  useSessionDetailQuery,
  useSubmitExamMutation,
} from "@/queries/exam";
import { useParams, useRouter } from "next/navigation";
import { useTimer } from "@/hooks/useTimer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/use-toast";

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

  const handeSelectOption = (questionId: string, selectedOptionId: string) => {
    saveAnswerMutation.mutate({
      sessionId,
      data: { questionId, selectedOptionId },
    });
  };

  if (isLoading) return <div className="p-6">Đang tải câu hỏi...</div>;
  if (isError)
    return <div className="p-6 text-red-600">Lỗi: {String(error)}</div>;
  if (!data) return <div className="p-6">Không có dữ liệu...</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ═══ TIMER HEADER (Fixed Top) ═══ */}
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

          {/* Question Count */}
          <div className="text-sm text-gray-600">
            {data.questions.length} câu hỏi
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

      {/* ═══ QUESTIONS (Scrollable Content) ═══ */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {data.questions.length} câu hỏi
        </h2>
        {data.questions.map((q) => (
          <div
            key={q.questionId}
            className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-4">
              Câu {q.order}:{" "}
              <span dangerouslySetInnerHTML={{ __html: q.contentHtml }} />
            </h3>
            <div className="space-y-3 pl-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="radio"
                    name={`q-${q.questionId}`}
                    value={opt.id}
                    checked={q.selectedOptionId === opt.id}
                    onChange={() => handeSelectOption(q.questionId, opt.id)}
                    className="flex-shrink-0 cursor-pointer"
                  />
                  <span
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: opt.contentHtml }}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ SUBMIT BUTTON (Fixed Bottom) ═══ */}
      <div className="bg-white border-t p-6 flex justify-center gap-4 sticky bottom-0">
        {/**
         * 🎓 THAY ĐỔI QUAN TRỌNG:
         * - onClick: submitMutation.mutate() → handleSubmitClick()
         * - Không submit ngay, mà mở dialog trước
         */}
        <button
          onClick={handleSubmitClick}
          disabled={submitMutation.isPending || isLoading}
          className={`px-12 py-3 rounded-lg font-semibold text-white text-lg transition-all shadow-md hover:shadow-lg ${
            submitMutation.isPending || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {submitMutation.isPending ? "⏳ Đang nộp..." : "✓ Nộp bài"}
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
  );
}
