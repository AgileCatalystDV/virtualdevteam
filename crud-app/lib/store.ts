"use client";

import { create } from "zustand";
import type { Item } from "./types";

const generateId = () => crypto.randomUUID();

const initialItems: Item[] = [
  {
    id: generateId(),
    title: "Eerste item",
    description: "Een voorbeeld item om mee te beginnen",
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Tweede item",
    description: "Nog een voorbeeld voor de CRUD demo",
    createdAt: new Date().toISOString(),
  },
];

interface ItemStore {
  items: Item[];
  addItem: (item: Omit<Item, "id" | "createdAt">) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | undefined;
}

export const useItemStore = create<ItemStore>((set, get) => ({
  items: initialItems,

  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  getItem: (id) => get().items.find((i) => i.id === id),
}));
