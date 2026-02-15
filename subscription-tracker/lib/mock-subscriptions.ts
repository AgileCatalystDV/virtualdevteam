/**
 * Gedeelde mock-datastore voor subscriptions API.
 * Beide route-bestanden importeren deze module — wijzigingen zijn zichtbaar in list én detail.
 *
 * @Fede — Fix BUG-001 t/m BUG-004
 */

import type { Subscription } from "./types";

const seed: Subscription[] = [
  {
    id: "sub-1",
    name: "Netflix",
    price: 15.99,
    currency: "EUR",
    billingCycle: "monthly",
    categoryId: "cat-streaming",
    nextBillingDate: "2026-03-14",
    notes: "Standard plan",
    isActive: true,
    createdAt: "2026-02-14T10:00:00.000Z",
    updatedAt: "2026-02-14T10:00:00.000Z",
  },
  {
    id: "sub-2",
    name: "Spotify",
    price: 9.99,
    currency: "EUR",
    billingCycle: "monthly",
    categoryId: "cat-streaming",
    nextBillingDate: "2026-03-01",
    notes: "",
    isActive: true,
    createdAt: "2026-02-14T10:00:00.000Z",
    updatedAt: "2026-02-14T10:00:00.000Z",
  },
  {
    id: "sub-3",
    name: "Microsoft 365",
    price: 99,
    currency: "EUR",
    billingCycle: "yearly",
    categoryId: "cat-software",
    nextBillingDate: "2027-02-14",
    notes: "Family plan",
    isActive: true,
    createdAt: "2026-02-14T10:00:00.000Z",
    updatedAt: "2026-02-14T10:00:00.000Z",
  },
];

/** Mutable array — gedeeld tussen alle API requests (module cache) */
export const mockSubscriptions: Subscription[] = [...seed];

export function getSubscriptionById(id: string): Subscription | undefined {
  return mockSubscriptions.find((s) => s.id === id);
}

export function addSubscription(sub: Subscription): void {
  mockSubscriptions.push(sub);
}

export function updateSubscription(id: string, updates: Partial<Subscription>): Subscription | undefined {
  const idx = mockSubscriptions.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  mockSubscriptions[idx] = {
    ...mockSubscriptions[idx],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };
  return mockSubscriptions[idx];
}

export function deleteSubscription(id: string): boolean {
  const idx = mockSubscriptions.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  mockSubscriptions.splice(idx, 1);
  return true;
}
