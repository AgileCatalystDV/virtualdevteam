"use client";

/**
 * API Data Provider — Eén fetch, gedeeld via context
 * @Fede — Sprint 5
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Subscription, Category } from "@/lib/types";
import {
  fetchSubscriptions,
  fetchCategories,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "@/lib/api-client";

function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return sessionStorage.getItem("auth_token") ?? undefined;
}

interface ApiDataContextValue {
  subscriptions: Subscription[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addSubscription: (data: Omit<Subscription, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  getSubscription: (id: string) => Subscription | undefined;
  getCategory: (id: string) => Category | undefined;
}

const ApiDataContext = createContext<ApiDataContextValue | null>(null);

export function ApiDataProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const [subs, cats] = await Promise.all([
        fetchSubscriptions(token),
        fetchCategories(token),
      ]);
      setSubscriptions(subs);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout bij laden");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addSubscription = useCallback(
    async (data: Omit<Subscription, "id" | "createdAt" | "updatedAt">) => {
      const created = await createSubscription(data, getToken());
      setSubscriptions((prev) => [...prev, created]);
    },
    []
  );

  const updateSub = useCallback(async (id: string, data: Partial<Subscription>) => {
    const updated = await updateSubscription(id, data, getToken());
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? updated : s))
    );
  }, []);

  const removeSubscription = useCallback(async (id: string) => {
    await deleteSubscription(id, getToken());
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSubscription = useCallback(
    (id: string) => subscriptions.find((s) => s.id === id),
    [subscriptions]
  );

  const getCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const value: ApiDataContextValue = {
    subscriptions,
    categories,
    loading,
    error,
    refetch,
    addSubscription,
    updateSubscription: updateSub,
    deleteSubscription: removeSubscription,
    getSubscription,
    getCategory,
  };

  return (
    <ApiDataContext.Provider value={value}>{children}</ApiDataContext.Provider>
  );
}

export function useApiData() {
  const ctx = useContext(ApiDataContext);
  if (!ctx) throw new Error("useApiData must be used within ApiDataProvider");
  return ctx;
}
