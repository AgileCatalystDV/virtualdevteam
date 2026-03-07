# Sprint 1 — Subscription Tracker MVP

**Co-PM Intelligence** — Aansturing  
**Status**: ✅ Sprint 1 Afgerond  
**Start**: 2026-02-14

---

## 🎯 Sprint Doel
Bouw de basis van de Subscription Tracker: data model, types, store, en volledige CRUD voor abonnementen.

---

## 📋 Taken & Verantwoordelijken

### ✅ Afgerond
| Taak | Verantwoordelijke | Status |
|------|-------------------|--------|
| Product specs | Co-PM, Alex | ✅ Done |
| Architectuur | Alex | ✅ Done |
| Go van Lead PM | Lead PM | ✅ Done |

### ✅ Sprint 1 Afgerond (2026-02-14)
| # | Taak | Status |
|---|------|--------|
| 1 | Types & interfaces (Subscription, Category) | ✅ |
| 2 | Zustand store (subscriptions + categories + seed data) | ✅ |
| 3 | Billing utils (monthly equivalent berekening) | ✅ |
| 4 | Subscription CRUD pagina's (list, new, edit) | ✅ |
| 5 | SubscriptionForm met alle velden | ✅ |
| 6 | SubscriptionCard component | ✅ |
| 7 | Dashboard met totalen (maandelijks, jaarlijks) | ✅ |

### ⏳ Volgende sprint (Sprint 2)
| # | Taak | Verantwoordelijke |
|---|------|-------------------|
| 7 | Dashboard met totalen (maandelijks, jaarlijks) | @Fede |
| 8 | Categorieën beheer (indien nodig) | @Fede |
| 9 | Code review | @Maya |

---

## 📁 Technische Referentie
- **Specs**: [SUBSCRIPTION_TRACKER_SPECS.md](./SUBSCRIPTION_TRACKER_SPECS.md)
- **Basis**: Bouw voort op `crud-app/` — hergebruik UI componenten (Button, Input, Card)
- **Locatie**: Nieuwe app `subscription-tracker/` of uitbreiding binnen bestaande structuur

---

## 📢 Co-PM Directieven

**@Fede** — Jij bent aan zet. Start met:
1. `lib/types.ts` — Subscription en Category interfaces volgens specs
2. `lib/store.ts` — Zustand store met seed categories + 2–3 voorbeeld subscriptions
3. `lib/utils.ts` — `getMonthlyEquivalent(price, billingCycle)` 
4. CRUD flow: subscriptions/list, new, [id]/edit — analoog aan items in crud-app

**@Alex** — Specs zijn klaar. Beschikbaar voor vragen over data model of architectuur.

**@Maya** — In Sprint 2: code review van Fede's werk. Voor nu: specs doornemen.

---

*Co-PM Intelligence — Aansturing Sprint 1*
