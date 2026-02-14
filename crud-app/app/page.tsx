import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <main className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Virtual Dev Team
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          CRUD applicatie — React stack met Next.js, TypeScript & Tailwind
        </p>
        <div className="mt-10">
          <Link
            href="/items"
            className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Naar Items CRUD →
          </Link>
        </div>
      </main>
    </div>
  );
}
