"use client";

import Link from "next/link";
import type { Subscription, Category } from "@/lib/types";
import { formatPrice, getMonthlyEquivalent } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface SubscriptionCardProps {
  subscription: Subscription;
  category?: Category;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({
  subscription,
  category,
  onDelete,
}: SubscriptionCardProps) {
  const monthlyEquivalent = getMonthlyEquivalent(
    subscription.price,
    subscription.billingCycle
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Weet je zeker dat je dit abonnement wilt verwijderen?")) {
      onDelete(subscription.id);
    }
  };

  const cycleLabel =
    subscription.billingCycle === "monthly"
      ? "maand"
      : subscription.billingCycle === "quarterly"
        ? "kwartaal"
        : "jaar";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {category && (
                <span
                  className="text-lg"
                  title={category.name}
                  style={{ color: category.color }}
                >
                  {category.icon}
                </span>
              )}
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {subscription.name}
              </h3>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {formatPrice(subscription.price, subscription.currency)} /{" "}
              {cycleLabel}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              ≈ {formatPrice(monthlyEquivalent, subscription.currency)}/maand
            </p>
            {subscription.notes && (
              <p className="mt-2 text-sm text-slate-500 italic">
                {subscription.notes}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Link href={`/subscriptions/${subscription.id}/edit`}>
            <Button variant="secondary" size="sm">
              Bewerken
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Verwijderen
          </Button>
        </div>
      </div>
    </Card>
  );
}
