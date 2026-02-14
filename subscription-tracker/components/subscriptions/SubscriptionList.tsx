"use client";

import { useSubscriptionStore } from "@/lib/store";
import { SubscriptionCard } from "./SubscriptionCard";

export function SubscriptionList() {
  const activeSubscriptions = useSubscriptionStore(
    (s) => s.getActiveSubscriptions()
  );
  const getCategory = useSubscriptionStore((s) => s.getCategory);
  const deleteSubscription = useSubscriptionStore((s) => s.deleteSubscription);

  if (activeSubscriptions.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
        <p className="text-slate-600">
          Nog geen abonnementen. Voeg er een toe om te beginnen!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {activeSubscriptions.map((sub) => (
        <SubscriptionCard
          key={sub.id}
          subscription={sub}
          category={getCategory(sub.categoryId)}
          onDelete={deleteSubscription}
        />
      ))}
    </div>
  );
}
