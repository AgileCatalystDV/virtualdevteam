import { NextRequest, NextResponse } from "next/server";
import type { Subscription, BillingCycle } from "@/lib/types";
import {
  mockSubscriptions,
  addSubscription,
} from "@/lib/mock-subscriptions";

export async function GET() {
  return NextResponse.json(mockSubscriptions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const now = new Date().toISOString();
  const newSub: Subscription = {
    id: `sub-${crypto.randomUUID().slice(0, 8)}`,
    name: body.name ?? "Nieuw abonnement",
    price: body.price ?? 0,
    currency: body.currency ?? "EUR",
    billingCycle: (body.billingCycle as BillingCycle) ?? "monthly",
    categoryId: body.categoryId ?? "cat-other",
    nextBillingDate: body.nextBillingDate ?? undefined,
    notes: body.notes ?? "",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  addSubscription(newSub);
  return NextResponse.json(newSub, { status: 201 });
}
