"use client";

import { create } from "zustand";
import type { Subscription, Category } from "./types";

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

const catIds = {
  streaming: "cat-streaming",
  software: "cat-software",
  fitness: "cat-fitness",
  media: "cat-media",
  cloud: "cat-cloud",
  insurance: "cat-insurance",
  fixed: "cat-fixed",
  vehicle: "cat-vehicle",
  health: "cat-health",
  finance: "cat-finance",
  other: "cat-other",
};

const defaultCategories: Category[] = [
  { id: catIds.streaming, name: "Streaming", icon: "🎬", color: "#E50914" },
  { id: catIds.software, name: "Software", icon: "💻", color: "#3B82F6" },
  { id: catIds.fitness, name: "Fitness", icon: "💪", color: "#10B981" },
  { id: catIds.media, name: "Nieuws & Media", icon: "📰", color: "#F59E0B" },
  { id: catIds.cloud, name: "Cloud Storage", icon: "☁️", color: "#8B5CF6" },
  { id: catIds.insurance, name: "Verzekeringen", icon: "🛡️", color: "#0EA5E9" },
  { id: catIds.fixed, name: "Vaste lasten", icon: "🏠", color: "#84CC16" },
  { id: catIds.vehicle, name: "Voertuig", icon: "🚗", color: "#6366F1" },
  { id: catIds.health, name: "Gezondheid", icon: "🏥", color: "#EC4899" },
  { id: catIds.finance, name: "Bank & Financiën", icon: "🏦", color: "#14B8A6" },
  { id: catIds.other, name: "Overig", icon: "📦", color: "#6B7280" },
];

/** Vaste seed data — geen generateId()/now() om hydration mismatch te voorkomen (server vs client) */
const defaultSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    name: "Netflix",
    price: 15.99,
    currency: "EUR",
    billingCycle: "monthly",
    categoryId: catIds.streaming,
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
    categoryId: catIds.streaming,
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
    categoryId: catIds.software,
    nextBillingDate: "2027-02-14",
    notes: "Family plan",
    isActive: true,
    createdAt: "2026-02-14T10:00:00.000Z",
    updatedAt: "2026-02-14T10:00:00.000Z",
  },
];

interface SubscriptionStore {
  subscriptions: Subscription[];
  categories: Category[];
  addSubscription: (sub: Omit<Subscription, "id" | "createdAt" | "updatedAt">) => void;
  updateSubscription: (id: string, sub: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
  getCategory: (id: string) => Category | undefined;
  getActiveSubscriptions: () => Subscription[];
}

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: defaultSubscriptions,
  categories: defaultCategories,

  addSubscription: (sub) => {
    const subscription: Subscription = {
      ...sub,
      id: generateId(),
      createdAt: now(),
      updatedAt: now(),
    };
    set((state) => ({
      subscriptions: [...state.subscriptions, subscription],
    }));
  },

  updateSubscription: (id, updates) => {
    set((state) => ({
      subscriptions: state.subscriptions.map((s) =>
        s.id === id
          ? { ...s, ...updates, updatedAt: now() }
          : s
      ),
    }));
  },

  deleteSubscription: (id) =>
    set((state) => ({
      subscriptions: state.subscriptions.filter((s) => s.id !== id),
    })),

  getSubscription: (id) => get().subscriptions.find((s) => s.id === id),
  getCategory: (id) => get().categories.find((c) => c.id === id),
  getActiveSubscriptions: () =>
    get().subscriptions.filter((s) => s.isActive),
}));
