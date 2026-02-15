"use client";

import { useApiData } from "@/components/providers/ApiDataProvider";

export function PageContent({ children }: { children: React.ReactNode }) {
  const { loading, error } = useApiData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Bezig met laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return <>{children}</>;
}
