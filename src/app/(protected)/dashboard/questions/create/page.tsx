import Link from "next/link";

export default function DashboardCreateQuestionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tao cau hoi</h1>
        <p className="text-muted-foreground">
          Day la trang tao moi, se duoc bo sung form chi tiet o buoc sau.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Skeleton route da tao thanh cong.
        </p>
        <div className="mt-4">
          <Link
            href="/dashboard/questions"
            className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
          >
            Quay ve danh sach cau hoi
          </Link>
        </div>
      </div>
    </div>
  );
}
