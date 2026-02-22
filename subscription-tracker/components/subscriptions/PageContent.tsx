"use client";

import { useMemo } from "react";
import { useApiData } from "@/components/providers/ApiDataProvider";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { EmptyState } from "./EmptyState";

export function PageContent({ children }: { children: React.ReactNode }) {
  const { loading, error, subscriptions, refetch } = useApiData();

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((s) => s.isActive),
    [subscriptions]
  );

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8">
        <p className="font-medium text-red-800">Er ging iets mis</p>
        <p className="mt-2 text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  if (activeSubscriptions.length === 0) {
    return <EmptyState />;
  }

  return <>{children}</>;
}
