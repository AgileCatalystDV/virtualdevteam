"use client";

import { useState } from "react";
import type { ItemFormData } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ItemFormProps {
  initialData?: ItemFormData;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function ItemForm({
  initialData = { title: "", description: "" },
  onSubmit,
  onCancel,
  submitLabel = "Opslaan",
}: ItemFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Titel is verplicht";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Voer een titel in"
        error={errors.title}
        required
      />
      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Beschrijving
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optionele beschrijving"
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuleren
        </Button>
      </div>
    </form>
  );
}
