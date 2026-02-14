export type BillingCycle = "monthly" | "quarterly" | "yearly";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  categoryId: string;
  nextBillingDate?: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFormData {
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  categoryId: string;
  nextBillingDate?: string;
  notes: string;
}
