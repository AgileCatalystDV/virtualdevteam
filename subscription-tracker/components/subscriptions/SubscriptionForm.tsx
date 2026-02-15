"use client";

import { useState } from "react";
import type { SubscriptionFormData, BillingCycle } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SubscriptionFormProps {
  initialData?: SubscriptionFormData;
  categories: { id: string; name: string; icon: string }[];
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "monthly", label: "Maandelijks" },
  { value: "quarterly", label: "Per kwartaal" },
  { value: "yearly", label: "Jaarlijks" },
];

export function SubscriptionForm({
  initialData = {
    name: "",
    price: 0,
    currency: "EUR",
    billingCycle: "monthly",
    categoryId: "",
    notes: "",
  },
  categories,
  onSubmit,
  onCancel,
  submitLabel = "Opslaan",
}: SubscriptionFormProps) {
  const [name, setName] = useState(initialData.name);
  const [price, setPrice] = useState(
    initialData.price > 0 ? String(initialData.price) : ""
  );
  const [currency] = useState(initialData.currency);
  const [billingCycle, setBillingCycle] = useState(initialData.billingCycle);
  const [categoryId, setCategoryId] = useState(initialData.categoryId || categories[0]?.id);
  const [nextBillingDate, setNextBillingDate] = useState(
    initialData.nextBillingDate || ""
  );
  const [notes, setNotes] = useState(initialData.notes || "");
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    category?: string;
    notes?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {
      name?: string;
      price?: string;
      category?: string;
      notes?: string;
    } = {};
    if (!name.trim()) newErrors.name = "Naam is verplicht";
    else if (name.length > 100) newErrors.name = "Naam mag max. 100 tekens zijn";
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0)
      newErrors.price = "Voer een geldig bedrag in";
    if (priceNum > 999999.99)
      newErrors.price = "Bedrag mag max. 999.999,99 zijn";
    const selectedCategoryId = categoryId || categories[0]?.id;
    if (!selectedCategoryId || categories.length === 0)
      newErrors.category = "Selecteer een categorie";
    if (notes.length > 500) newErrors.notes = "Notities mogen max. 500 tekens zijn";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      name: name.trim(),
      price: priceNum,
      currency,
      billingCycle,
      categoryId: selectedCategoryId,
      nextBillingDate: nextBillingDate || undefined,
      notes: notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Naam"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="bijv. Netflix"
        error={errors.name}
        required
        maxLength={100}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prijs"
          type="number"
          step="0.01"
          min="0"
          max="999999.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="9.99"
          error={errors.price}
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Facturatie
          </label>
          <select
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
          >
            {BILLING_CYCLES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Categorie
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={`w-full rounded-lg border px-4 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 ${errors.category ? "border-red-500" : "border-slate-300"}`}
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? "category-error" : undefined}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="category-error" className="mt-1 text-sm text-red-600">
            {errors.category}
          </p>
        )}
      </div>
      <Input
        label="Volgende factuurdatum (optioneel)"
        type="date"
        value={nextBillingDate}
        onChange={(e) => setNextBillingDate(e.target.value)}
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Notities
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optionele notities"
          rows={2}
          maxLength={500}
          className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 ${errors.notes ? "border-red-500" : "border-slate-300"}`}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">{notes.length}/500</p>
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
