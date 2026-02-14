"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useItemStore } from "@/lib/store";
import { ItemForm } from "@/components/crud/ItemForm";
import { Card } from "@/components/ui/Card";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const getItem = useItemStore((s) => s.getItem);
  const updateItem = useItemStore((s) => s.updateItem);

  const item = getItem(id);

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Item niet gevonden
          </h2>
          <Link
            href="/items"
            className="mt-4 inline-block text-slate-600 hover:text-slate-900"
          >
            ← Terug naar items
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: { title: string; description: string }) => {
    updateItem(id, data);
    router.push("/items");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900">Item bewerken</h1>
          <p className="mt-1 text-sm text-slate-600">
            Wijzig de gegevens van dit item
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
            initialData={{
              title: item.title,
              description: item.description,
            }}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/items")}
            submitLabel="Wijzigingen opslaan"
          />
        </Card>
      </main>
    </div>
  );
}
