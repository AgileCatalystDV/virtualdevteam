"use client";

import Link from "next/link";
import { SubscriptionList } from "@/components/subscriptions/SubscriptionList";
import { Button } from "@/components/ui/Button";

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Abonnementen
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Beheer al je abonnementen op één plek
              </p>
            </div>
            <Link href="/subscriptions/new">
              <Button size="lg">+ Nieuw abonnement</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Terug naar dashboard
          </Link>
        </div>
        <SubscriptionList />
      </main>
    </div>
  );
}
