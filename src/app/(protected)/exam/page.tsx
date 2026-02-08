import Link from "next/link";

const EXAM_ID = "89f4a282-776f-450c-b431-757cb6e2b798";

export default function ExamPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Danh sách đề thi</h1>

      <Link href={`/exam/${EXAM_ID}`} className="text-blue-600 hover:underline">
        Mở đề thi mẫu
      </Link>
    </div>
  );
}
