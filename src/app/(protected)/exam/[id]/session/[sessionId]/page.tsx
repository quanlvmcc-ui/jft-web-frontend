"use client";

import { useParams } from "next/navigation";

export default function ExamSessionPage() {
  const params = useParams<{ id: string; sessionId: string }>();
  const examId = params?.id ?? "";
  const sessionId = params?.sessionId ?? "";

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-xl font-semibold">Phiên làm bài</h1>
      <div className="text-sm text-muted-foreground">Exam: {examId}</div>
      <div className="text-sm text-muted-foreground">Session: {sessionId}</div>
      <div className="text-sm">
        TODO: gọi API lấy câu hỏi và render danh sách câu hỏi.
      </div>
    </div>
  );
}
