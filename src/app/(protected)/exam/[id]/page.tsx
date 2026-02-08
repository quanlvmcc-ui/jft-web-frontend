"use client";

import { useParams } from "next/navigation";
import { usePublishedExamQuery } from "@/queries/exam";

export default function ExamDetailPage() {
  const params = useParams<{ id: string }>();
  const examId = params?.id ?? "";
  const { data, isLoading, isError, error } = usePublishedExamQuery({
    examId,
  });

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
        <div className="text-sm">Thời gian: {data.timeLimit} phút</div>
        <div className="text-sm">Trạng thái: {data.status}</div>
      </div>
    </div>
  );
}
