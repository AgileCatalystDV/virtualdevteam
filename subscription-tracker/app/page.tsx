import Link from "next/link";
import { DashboardSummary } from "@/components/subscriptions/DashboardSummary";
import { SubscriptionList } from "@/components/subscriptions/SubscriptionList";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Subscription Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Overzicht van al je abonnementen — wat betaal je, wanneer, en
            hoeveel in totaal?
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardSummary />

        <div className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Mijn abonnementen
            </h2>
            <Link
              href="/subscriptions/new"
              className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              + Nieuw abonnement
            </Link>
          </div>
          <div className="mt-4">
            <SubscriptionList />
          </div>
        </div>
      </main>
    </div>
  );
}
