import type { BillingCycle } from "./types";

/**
 * Berekent het maandelijks equivalent van een prijs op basis van billing cycle.
 * monthly: prijs = maandelijks bedrag
 * quarterly: prijs / 3
 * yearly: prijs / 12
 */
export function getMonthlyEquivalent(
  price: number,
  billingCycle: BillingCycle
): number {
  if (price < 0) return 0;
  switch (billingCycle) {
    case "monthly":
      return price;
    case "quarterly":
      return price / 3;
    case "yearly":
      return price / 12;
    default:
      return price;
  }
}

/**
 * Formatteert prijs voor weergave
 */
export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency,
  }).format(price);
}
