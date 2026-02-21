/**
 * api-client unit tests
 * @Maya + @Fede — Frontend testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchCategories,
  fetchSubscriptions,
  createSubscription,
} from "./api-client";

describe("api-client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.stubGlobal("fetch", originalFetch);
  });

  describe("fetchCategories", () => {
    it("retourneert categories bij succesvolle response", async () => {
      const mockCategories = [
        { id: "cat-1", name: "Streaming", icon: "🎬", color: "#E50914" },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      });

      const result = await fetchCategories();
      expect(result).toEqual(mockCategories);
    });

    it("gooit Error bij 404", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(fetchCategories()).rejects.toThrow();
    });

    it("gooit Error bij 500", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(fetchCategories()).rejects.toThrow();
    });
  });

  describe("fetchSubscriptions", () => {
    it("retourneert subscriptions bij succesvolle response", async () => {
      const mockSubs = [
        {
          id: "sub-1",
          name: "Netflix",
          price: 9.99,
          currency: "EUR",
          billingCycle: "monthly",
          categoryId: "cat-1",
          notes: "",
          isActive: true,
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSubs),
      });

      const result = await fetchSubscriptions();
      expect(result).toEqual(mockSubs);
    });

    it("stuurt Authorization header mee bij token", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await fetchSubscriptions("my-token");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-token",
          }),
        })
      );
    });
  });

  describe("createSubscription", () => {
    it("stuurt POST met correcte body", async () => {
      const newSub = {
        name: "Netflix",
        price: 9.99,
        currency: "EUR",
        billingCycle: "monthly" as const,
        categoryId: "cat-1",
        notes: "",
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...newSub, id: "sub-1", isActive: true, createdAt: "", updatedAt: "" }),
      });

      await createSubscription(newSub);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/subscriptions"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(newSub),
        })
      );
    });
  });
});
