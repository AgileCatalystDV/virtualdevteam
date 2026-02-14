# Code Review Report — Subscription Tracker (Sprint 2)

**Reviewer**: Maya (QA Engineer)  
**Datum**: 2026-02-14  
**Scope**: `subscription-tracker/` — MVP codebase

---

## 📋 Samenvatting

De codebase is over het algemeen goed gestructureerd en volgt de specs. Er zijn geen blocking issues, wel enkele suggestions en nice-to-haves voor betere robuustheid en onderhoudbaarheid.

---

## 🛑 Blocking Issues (Moet gerepareerd worden)

*Geen blocking issues gevonden.*

---

## ⚠️ Suggestions (Zou moeten verbeteren)

### 1. **SubscriptionForm** — Lege categories edge case
- **File**: `components/subscriptions/SubscriptionForm.tsx` (regel 64)
- **Issue**: Bij lege `categories` array wordt `categoryId: categoryId || categories[0]?.id` mogelijk `undefined`. De store verwacht een geldige `categoryId`.
- **Suggestie**: Voeg guard toe: als `categories.length === 0`, toon melding of disable submit. Of: valideer dat `categoryId` niet leeg is voor submit.

### 2. **DRY — Duplicate `activeSubscriptions` filter**
- **Files**: `DashboardSummary.tsx`, `SubscriptionList.tsx`
- **Issue**: Beide componenten filteren `subscriptions.filter((s) => s.isActive)`. Dubbele logica.
- **Suggestie**: Exporteer `getActiveSubscriptions` selector uit de store, of maak een custom hook `useActiveSubscriptions()`.

### 3. **getMonthlyEquivalent — Defensieve check**
- **File**: `lib/utils.ts` (regel 9-23)
- **Issue**: Bij negatieve `price` (bv. door corrupte data) geeft de functie negatieve waarden terug → dashboard toont negatieve totalen.
- **Suggestie**: Voeg toe: `if (price < 0) return 0;` of gooi een error. Data zou altijd gevalideerd moeten zijn, maar defensief programmeren helpt.

### 4. **SubscriptionCard — Ontbrekende category fallback**
- **File**: `components/subscriptions/SubscriptionCard.tsx`
- **Issue**: Als `getCategory(sub.categoryId)` `undefined` retourneert (bijv. category verwijderd), toont de card geen icoon. Werkt, maar UX kan beter.
- **Suggestie**: Toon fallback icoon (📦) of "Onbekende categorie" wanneer category ontbreekt.

---

## ✅ Nice to haves

1. **Select component** — De native `<select>` in SubscriptionForm en categorie-dropdown zouden herbruikbaar gemaakt kunnen worden als `Select` component (consistent met `Input`, `Button`).
2. **Loading state** — Bij `router.push()` na submit is er geen feedback. Een korte "Bezig met opslaan..." zou de UX verbeteren (vooral relevant bij toekomstige API-calls).
3. **Toegankelijkheid** — `confirm()` voor delete is functioneel maar niet ideaal voor screen readers. Overweeg een modal component met focus trap.
4. **formatPrice** — Bij `monthlyTotal === 0` toont `formatPrice(0)` "€0,00" — correct. Geen actie nodig.

---

## ✅ Wat goed gaat

- **TypeScript**: Consistente types, geen `any`.
- **Component structuur**: Duidelijke scheiding UI vs. business logic.
- **Validatie**: SubscriptionForm valideert name en price correct.
- **Edge case**: Edit-pagina handelt "niet gevonden" netjes af.
- **Naming**: Beschrijvende variabele- en functienamen.
- **Geen console.log** in productiecode.

---

---

## 📝 Follow-up (Fede)

Alle suggestions geadresseerd:
- ✅ **#1** Category validatie toegevoegd in SubscriptionForm
- ✅ **#2** `getActiveSubscriptions()` selector in store, DRY in DashboardSummary & SubscriptionList
- ✅ **#3** Defensieve check `price < 0` in getMonthlyEquivalent
- ✅ **#4** Fallback icoon (📦) en "Onbekende categorie" in SubscriptionCard

*Maya — QA Engineer — Code Review Sprint 2*
