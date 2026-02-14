"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSubscriptionStore } from "@/lib/store";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { Card } from "@/components/ui/Card";

export default function NewSubscriptionPage() {
  const router = useRouter();
  const { addSubscription, categories } = useSubscriptionStore();

  const handleSubmit = (data: {
    name: string;
    price: number;
    currency: string;
    billingCycle: "monthly" | "quarterly" | "yearly";
    categoryId: string;
    nextBillingDate?: string;
    notes: string;
  }) => {
    addSubscription({
      ...data,
      isActive: true,
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Nieuw abonnement
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Voeg een nieuw abonnement toe aan je overzicht
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Terug naar dashboard
          </Link>
        </div>
        <Card>
          <SubscriptionForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/")}
            submitLabel="Abonnement toevoegen"
          />
        </Card>
      </main>
    </div>
  );
}
