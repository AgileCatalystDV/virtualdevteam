"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSubscriptionStore } from "@/lib/store";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { Card } from "@/components/ui/Card";

export default function EditSubscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const getSubscription = useSubscriptionStore((s) => s.getSubscription);
  const updateSubscription = useSubscriptionStore((s) => s.updateSubscription);
  const categories = useSubscriptionStore((s) => s.categories);

  const subscription = getSubscription(id);

  if (!subscription) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Abonnement niet gevonden
          </h2>
          <Link
            href="/"
            className="mt-4 inline-block text-slate-600 hover:text-slate-900"
          >
            ← Terug naar dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: {
    name: string;
    price: number;
    currency: string;
    billingCycle: "monthly" | "quarterly" | "yearly";
    categoryId: string;
    nextBillingDate?: string;
    notes: string;
  }) => {
    updateSubscription(id, data);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Abonnement bewerken
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Wijzig de gegevens van dit abonnement
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
            initialData={{
              name: subscription.name,
              price: subscription.price,
              currency: subscription.currency,
              billingCycle: subscription.billingCycle,
              categoryId: subscription.categoryId,
              nextBillingDate: subscription.nextBillingDate,
              notes: subscription.notes,
            }}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/")}
            submitLabel="Wijzigingen opslaan"
          />
        </Card>
      </main>
    </div>
  );
}
