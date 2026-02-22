"use client";

/**
 * Skeleton loader voor dashboard — Tijdens data laden
 * @Fede — Usability verbetering
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Bezig met laden">
      {/* Summary cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-9 w-24 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* List section skeleton */}
      <div>
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Bezig met laden...</span>
    </div>
  );
}
