"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useItemStore } from "@/lib/store";
import { ItemForm } from "@/components/crud/ItemForm";
import { Card } from "@/components/ui/Card";

export default function NewItemPage() {
  const router = useRouter();
  const addItem = useItemStore((s) => s.addItem);

  const handleSubmit = (data: { title: string; description: string }) => {
    addItem(data);
    router.push("/items");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">Nieuw item</h1>
          <p className="mt-1 text-sm text-slate-600">
            Voeg een nieuw item toe aan de lijst
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/items"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Terug naar items
          </Link>
        </div>
        <Card>
          <ItemForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/items")}
            submitLabel="Item aanmaken"
          />
        </Card>
      </main>
    </div>
  );
}
