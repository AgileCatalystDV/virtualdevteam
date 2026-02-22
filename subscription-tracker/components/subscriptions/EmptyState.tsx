"use client";

import Link from "next/link";

/**
 * Empty state — Toont wanneer er nog geen abonnementen zijn
 * @Fede — Usability verbetering
 */
export function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center sm:p-16">
      <div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl"
        aria-hidden
      >
        📋
      </div>
      <h2 className="text-xl font-semibold text-slate-900">
        Welkom bij Subscription Tracker
      </h2>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        Voeg je abonnementen toe — streaming, software, verzekeringen, vaste
        lasten — en krijg direct inzicht in wat je maandelijks en jaarlijks
        uitgeeft.
      </p>
      <Link
        href="/subscriptions/new"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-slate-800 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        + Voeg je eerste abonnement toe
      </Link>
    </div>
  );
}
