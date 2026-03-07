import Link from "next/link";

export default function DashboardExamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">De thi</h1>
        <p className="text-muted-foreground">
          Trang quan ly de thi da san sang skeleton route.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Buoc tiep theo: hien thi danh sach de thi va trang thai phat hanh.
        </p>
        <div className="mt-4">
          <Link
            href="/dashboard/exams/create"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Tao de thi moi
          </Link>
        </div>
      </div>
    </div>
  );
}
