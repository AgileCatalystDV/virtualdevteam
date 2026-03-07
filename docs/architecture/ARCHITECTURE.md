# Architecture Documentation

Dit document bevat de architectuur documentatie voor het project.

## Overzicht
Alex (Architect) schrijft en onderhoudt dit document. Het beschrijft:
- Systeemcomponenten en hun interacties
- Data flows
- Technische beslissingen en rationale
- Performance overwegingen
- Security measures

## Technologie Stack
- **Frontend**: Next.js 14, React 19, TypeScript 5.3, Tailwind CSS
- **Backend**: Node.js 20, Express 5, Python 3.12, FastAPI
- **Database**: PostgreSQL 16, Redis 7
- **DevOps**: Docker 25, Kubernetes 1.29, GitHub Actions
- **Security**: OWASP ZAP, Snyk, Dependabot

---

## CRUD Applicatie - Architectuur Plan

### 🎯 Overzicht
Een generieke CRUD (Create, Read, Update, Delete) applicatie als frontend template. Gebruikt Next.js 14 App Router voor schaalbare, modulaire structuur. Voor nu: client-side state met mock data; later uitbreidbaar naar @Floyd backend API.

### 🏗️ Project Structuur

```
virtualdevteam/
├── crud-app/                     # Next.js CRUD applicatie
│   ├── app/                      # App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Home
│   │   ├── globals.css
│   │   └── items/                # CRUD entity
│   │       ├── page.tsx          # List (Read)
│   │       ├── new/page.tsx      # Create
│   │       └── [id]/edit/page.tsx # Update
│   ├── components/
│   │   ├── ui/                   # Button, Input, Card
│   │   └── crud/                 # ItemList, ItemForm, ItemCard
│   └── lib/
│       ├── types.ts
│       └── store.ts              # Zustand state
└── docs/
```

### 🔄 Data Flow

```
[User] → [Page Component] → [CRUD Component] → [Store/API]
                ↑                                      ↓
                └────────── [State Update] ←─────────────┘
```

### 📦 Entity Model (voorbeeld: Item)

| Veld    | Type     | Beschrijving   |
|---------|----------|----------------|
| id      | string   | UUID           |
| title   | string   | Verplicht      |
| description | string | Optioneel   |
| createdAt | string | ISO date     |

### ⚡ Performance Overwegingen
- **Code splitting**: App Router doet automatisch route-based splitting
- **Client components**: Alleen waar interactiviteit nodig is (`'use client'`)
- **Server Components**: Default voor statische content

### 🔒 Security Measures (voor later)
- Input validatie op form submit
- XSS preventie via React escaping
- Rate limiting bij API integratie (@Floyd)

---

## Subscription Tracker — Architectuur

**Zie**: [SUBSCRIPTION_TRACKER_SPECS.md](./SUBSCRIPTION_TRACKER_SPECS.md) voor volledige product- en technische specificaties.

### Samenvatting
- **Data model**: `subscriptions` + `categories` (beperkte DB)
- **Fase 1**: Frontend-only, Zustand store, bouwt voort op crud-app structuur
- **Fase 2**: @Floyd backend API, PostgreSQL, authenticatie
- **Fase 3**: Monetization (budget alerts, premium tier)

---

## Google Cloud Architectuur

**Zie**: [GCP_ARCHITECTURE.md](./GCP_ARCHITECTURE.md)

**Aanbeveling Alex**: Cloud Run + Cloud SQL (PostgreSQL). Serverless, schaalbaar, cost-effective. Alternatief: Firestore voor nog eenvoudigere ops.

---
*Architectuur CRUD app toegevoegd door @Alex — 2026-02-14*  
*Subscription Tracker specs toegevoegd — 2026-02-14*  
*GCP architectuur — 2026-02-14*
