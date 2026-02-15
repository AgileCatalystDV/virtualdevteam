/**
 * API Client — Abstraction layer voor Subscription Tracker
 * Switcht tussen mock (/api/v1) en production (Cloud Run) via NEXT_PUBLIC_API_URL
 *
 * @Floyd — Voorbereiding GCP migratie
 */

import type { Subscription, Category } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "/api/v1";

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(res.statusText || `API error ${res.status}`);
  }
  return res.json();
}

// ——— Categories ———

export async function fetchCategories(token?: string): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`, {
    headers: getHeaders(token),
  });
  return handleResponse<Category[]>(res);
}

// ——— Subscriptions ———

export async function fetchSubscriptions(
  token?: string
): Promise<Subscription[]> {
  const res = await fetch(`${API_BASE}/subscriptions`, {
    headers: getHeaders(token),
  });
  return handleResponse<Subscription[]>(res);
}

export async function fetchSubscription(
  id: string,
  token?: string
): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
    headers: getHeaders(token),
  });
  return handleResponse<Subscription>(res);
}

export async function createSubscription(
  data: Omit<Subscription, "id" | "createdAt" | "updatedAt">,
  token?: string
): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/subscriptions`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse<Subscription>(res);
}

export async function updateSubscription(
  id: string,
  data: Partial<Subscription>,
  token?: string
): Promise<Subscription> {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse<Subscription>(res);
}

export async function deleteSubscription(
  id: string,
  token?: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(res.statusText);
}
