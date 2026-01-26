import { http } from "@/lib/http";

export default function HomePage() {
  console.log(http);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">JFT Practice Frontend</h1>
    </main>
  );
}
