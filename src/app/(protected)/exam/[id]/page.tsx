"use client";

import { useParams, useRouter } from "next/navigation";
import { usePublishedExamQuery, useStartSessionMutation } from "@/queries/exam";
import { Button } from "@/components/ui/button";

export default function ExamDetailPage() {
  const params = useParams<{ id: string }>();
  const examId = params?.id ?? "";
  const router = useRouter();
  const { data, isLoading, isError, error } = usePublishedExamQuery({
    examId,
  });
  const startSessionMutation = useStartSessionMutation();

  const handleStart = async () => {
    const session = await startSessionMutation.mutateAsync(examId);
    router.push(`/exam/${examId}/session/${session.id}`);
  };

  if (isLoading) {
    return <div className="p-6">Đang tải đề thi...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">Lỗi tải đề thi: {String(error)}</div>
    );
  }

  if (!data) {
    return <div className="p-6">Không tìm thấy đề thi.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Chi tiết đề thi</h1>

      <div className="space-y-2">
        <div className="text-lg font-medium">{data.title}</div>
        {data.description && (
          <div className="text-sm text-muted-foreground">
            {data.description}
          </div>
        )}
        <div className="text-sm">
          Thời gian: {Math.floor(data.timeLimit / 60)} phút
        </div>
        <div className="text-sm">Trạng thái: {data.status}</div>
        <Button
          onClick={handleStart}
          className="mt-4"
          disabled={startSessionMutation.isPending}
        >
          {startSessionMutation.isPending
            ? "Đang tạo phiên làm bài..."
            : "Bắt đầu làm bài"}
        </Button>
      </div>
    </div>
  );
}
