import Link from "next/link";

export default function DashboardQuestionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cau hoi</h1>
        <p className="text-muted-foreground">
          Trang danh sach cau hoi da san sang skeleton route.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Buoc tiep theo: ket noi TanStack Query va render bang du lieu tu API.
        </p>
        <div className="mt-4">
          <Link
            href="/dashboard/questions/create"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Tao cau hoi moi
          </Link>
        </div>
      </div>
    </div>
  );
}
