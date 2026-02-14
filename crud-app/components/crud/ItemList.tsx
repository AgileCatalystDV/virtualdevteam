"use client";

import { useItemStore } from "@/lib/store";
import { ItemCard } from "./ItemCard";

export function ItemList() {
  const { items, deleteItem } = useItemStore();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
        <p className="text-slate-600">Nog geen items. Maak er een aan!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onDelete={deleteItem} />
      ))}
    </div>
  );
}
