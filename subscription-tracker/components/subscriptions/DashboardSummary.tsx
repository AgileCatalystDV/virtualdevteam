"use client";

import { useMemo } from "react";
import { useApiData } from "@/components/providers/ApiDataProvider";
import { getMonthlyEquivalent, formatPrice } from "@/lib/utils";

export function DashboardSummary() {
  const { subscriptions } = useApiData();
  const activeSubscriptions = useMemo(
    () => subscriptions.filter((s) => s.isActive),
    [subscriptions]
  );

  const monthlyTotal = activeSubscriptions.reduce(
    (sum, sub) => sum + getMonthlyEquivalent(sub.price, sub.billingCycle),
    0
  );

  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Totaal per maand (equivalent)
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {formatPrice(monthlyTotal)}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Totaal per jaar (equivalent)
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          {formatPrice(yearlyTotal)}
        </p>
      </div>
    </div>
  );
}
