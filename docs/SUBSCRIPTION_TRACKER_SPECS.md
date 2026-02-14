# Subscription Tracker — Product Specificatie

**Status**: Goedgekeurd door Lead PM  
**Datum**: 2026-02-14  
**Auteurs**: Co-PM Intelligence, Architect Alex, Lead PM

---

## 📋 Discussie & Besluitvorming

### Co-PM Intelligence
*"Subscription Tracker scoort het beste op beperkte database, marktvraag en monetiseerbaarheid. Minimale DB: subscriptions + categories. Monetization: gratis basis, premium voor budget alerts, export, herinneringen."*

### Architect Alex
*"Beperkt datamodel past bij onze stack. Ik stel voor: RESTful API, PostgreSQL voor persistentie, Next.js frontend bouwt voort op bestaande CRUD-structuur. Fase 1: client-side state (zoals Items CRUD), Fase 2: @Floyd backend + DB."*

### Lead PM
*"Voorstel is prima. Laat Alex en Co-PM specs verder uitwerken. Specs duidelijk door discussie met ons 3."*

### Co-PM + Alex (gezamenlijk)
*"Hieronder de uitgewerkte specificaties."*

---

## 🎯 Product Visie

**One-liner**: Overzicht van al je abonnementen — wat betaal je, wanneer, en hoeveel in totaal?

**Doelgroep**: Consumenten met 3+ abonnementen (streaming, software, fitness, etc.) die overzicht willen.

**Waarde**: Inzicht in maandelijkse/jaarlijkse kosten, herinneringen voor vervaldatum, mogelijkheid om ongebruikte abo's te identificeren.

---

## 📦 Data Model (Alex)

### Tabel: `subscriptions`

| Veld | Type | Verplicht | Beschrijving |
|------|------|-----------|--------------|
| id | UUID | ✓ | Primary key |
| name | string | ✓ | Naam abonnement (bijv. "Netflix") |
| price | decimal | ✓ | Prijs per cyclus |
| currency | string | ✓ | ISO 4217 (EUR, USD) — default: EUR |
| billing_cycle | enum | ✓ | `monthly`, `quarterly`, `yearly` |
| category_id | UUID | ✓ | FK naar categories |
| next_billing_date | date | | Volgende factuurdatum |
| notes | text | | Vrije notities |
| is_active | boolean | ✓ | Default: true |
| created_at | timestamp | ✓ | |
| updated_at | timestamp | ✓ | |

### Tabel: `categories`

| Veld | Type | Verplicht | Beschrijving |
|------|------|-----------|--------------|
| id | UUID | ✓ | Primary key |
| name | string | ✓ | bijv. "Streaming", "Software" |
| icon | string | | Emoji of icon identifier |
| color | string | | Hex voor UI (bijv. #3B82F6) |

### Standaard categorieën (seed data)
- Streaming (🎬)
- Software (💻)
- Fitness (💪)
- Nieuws & Media (📰)
- Cloud Storage (☁️)
- Overig (📦)

---

## 📐 Functionele Specificaties

### MVP (Fase 1) — Goedgekeurd

| # | Feature | Beschrijving | Prioriteit |
|---|---------|--------------|------------|
| 1 | **Subscription CRUD** | Aanmaken, bekijken, bewerken, verwijderen van abonnementen | P0 |
| 2 | **Categorieën** | Abonnement toewijzen aan categorie; categorieën beheren | P0 |
| 3 | **Dashboard** | Overzicht: totaal per maand/jaar, lijst per categorie | P0 |
| 4 | **Billing cycle** | Maandelijks, per kwartaal, jaarlijks — automatische omrekening naar maandelijks equivalent | P0 |
| 5 | **Valuta** | EUR default; veld voor toekomstige multi-currency | P1 |

### Fase 2 (Post-MVP)

| # | Feature | Beschrijving |
|---|---------|--------------|
| 6 | **Backend API** | @Floyd: Express/FastAPI, PostgreSQL |
| 7 | **Authenticatie** | Login/registratie — data per user |
| 8 | **Herinneringen** | Notificatie bij aanstaande vervaldatum |
| 9 | **Export** | CSV/PDF export van abonnementen |

### Fase 3 (Monetization)

| # | Feature | Beschrijving |
|---|---------|--------------|
| 10 | **Budget alerts** | Waarschuwing bij overschrijding maandelijks budget |
| 11 | **Premium** | Betaalde tier voor advanced features |

---

## 🏗️ Technische Architectuur (Alex)

### Fase 1 — Frontend-only (MVP)

```
subscription-tracker/          # Nieuwe app of uitbreiding crud-app
├── app/
│   ├── page.tsx              # Dashboard (totalen, overzicht)
│   ├── subscriptions/         # CRUD (zoals items)
│   │   ├── page.tsx           # List
│   │   ├── new/page.tsx       # Create
│   │   └── [id]/edit/page.tsx # Update
│   └── categories/            # Categorie beheer (optioneel MVP)
├── components/
│   ├── ui/                    # Herbruikbaar van crud-app
│   └── subscriptions/         # SubscriptionCard, SubscriptionForm, DashboardSummary
├── lib/
│   ├── types.ts               # Subscription, Category interfaces
│   ├── store.ts               # Zustand (subscriptions + categories)
│   └── utils.ts               # Billing cycle omrekening (yearly → monthly)
```

### Billing cycle omrekening
- **monthly**: prijs = maandelijks bedrag
- **quarterly**: prijs / 3 = maandelijks equivalent
- **yearly**: prijs / 12 = maandelijks equivalent

### Fase 2 — Backend (voor @Floyd)
- REST API: `GET/POST/PUT/DELETE /api/subscriptions`
- REST API: `GET/POST/PUT/DELETE /api/categories`
- PostgreSQL schema zoals hierboven
- Authenticatie: JWT of session-based

---

## 🔒 Security Overwegingen (voor PenPeter)

| Aspect | MVP | Fase 2+ |
|--------|-----|---------|
| Input validatie | Client-side (title, price, dates) | + Server-side |
| XSS | React escaping | Idem |
| Auth | N.v.t. (lokaal) | JWT, secure cookies |
| Data isolatie | N.v.t. | Per user (tenant) |
| Sensitive data | Geen payment details | Alleen metadata |

---

## 📅 Voorgestelde Planning (Co-PM)

| Sprint | Focus | Verantwoordelijke |
|--------|-------|-------------------|
| 1 | Data model, types, store, basis CRUD | @Alex (spec) → @Fede |
| 2 | Dashboard, categorieën, billing logic | @Fede |
| 3 | Polish, edge cases, @Maya review | @Fede, @Maya |
| 4+ | Backend, auth (indien gewenst) | @Floyd, @Ian |

---

## ✅ Goedkeuring

| Rol | Status | Datum |
|-----|--------|-------|
| Lead PM | ✅ Goedgekeurd | 2026-02-14 |
| Co-PM Intelligence | ✅ Specs uitgewerkt | 2026-02-14 |
| Architect Alex | ✅ Architectuur gedocumenteerd | 2026-02-14 |

---

*Document bijgewerkt na discussie Lead PM, Co-PM, Alex.*
