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
  other: "cat-other",
};

const defaultCategories: Category[] = [
  { id: catIds.streaming, name: "Streaming", icon: "🎬", color: "#E50914" },
  { id: catIds.software, name: "Software", icon: "💻", color: "#3B82F6" },
  { id: catIds.fitness, name: "Fitness", icon: "💪", color: "#10B981" },
  { id: catIds.media, name: "Nieuws & Media", icon: "📰", color: "#F59E0B" },
  { id: catIds.cloud, name: "Cloud Storage", icon: "☁️", color: "#8B5CF6" },
  { id: catIds.other, name: "Overig", icon: "📦", color: "#6B7280" },
];

const defaultSubscriptions: Subscription[] = [
  {
    id: generateId(),
    name: "Netflix",
    price: 15.99,
    currency: "EUR",
    billingCycle: "monthly",
    categoryId: catIds.streaming,
    nextBillingDate: "2026-03-14",
    notes: "Standard plan",
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: "Spotify",
    price: 9.99,
    currency: "EUR",
    billingCycle: "monthly",
    categoryId: catIds.streaming,
    nextBillingDate: "2026-03-01",
    notes: "",
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    name: "Microsoft 365",
    price: 99,
    currency: "EUR",
    billingCycle: "yearly",
    categoryId: catIds.software,
    nextBillingDate: "2027-02-14",
    notes: "Family plan",
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
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
