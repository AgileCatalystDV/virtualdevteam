"use client";

import Link from "next/link";
import type { Item } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Weet je zeker dat je dit item wilt verwijderen?")) {
      onDelete(item.id);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Link href={`/items/${item.id}/edit`}>
            <Button variant="secondary" size="sm">
              Bewerken
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Verwijderen
          </Button>
        </div>
      </div>
    </Card>
  );
}
