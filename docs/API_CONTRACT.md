# API Contract — Subscription Tracker

**Auteur**: Architect Alex  
**Datum**: 2026-02-14  
**Doel**: Specificatie voor toekomstige backend (Fase 2)

---

## Base URL
```
/api/v1
```

---

## Endpoints

### Subscriptions

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET | `/subscriptions` | Lijst alle abonnementen (gefilterd op user) |
| GET | `/subscriptions/:id` | Haal één abonnement op |
| POST | `/subscriptions` | Maak nieuw abonnement |
| PUT | `/subscriptions/:id` | Update abonnement |
| DELETE | `/subscriptions/:id` | Verwijder abonnement |

### Categories

| Method | Endpoint | Beschrijving |
|--------|----------|--------------|
| GET | `/categories` | Lijst alle categorieën |
| GET | `/categories/:id` | Haal één categorie op |
| POST | `/categories` | Maak nieuwe categorie *(Fase 2+)* |
| PUT | `/categories/:id` | Update categorie *(Fase 2+)* |
| DELETE | `/categories/:id` | Verwijder categorie *(Fase 2+)* |

---

## Data Models

### Subscription

```json
{
  "id": "uuid",
  "name": "string (max 100)",
  "price": "number (0-999999.99)",
  "currency": "string (ISO 4217)",
  "billingCycle": "monthly | quarterly | yearly",
  "categoryId": "uuid",
  "nextBillingDate": "date (ISO 8601) | null",
  "notes": "string (max 500) | null",
  "isActive": "boolean",
  "createdAt": "datetime (ISO 8601)",
  "updatedAt": "datetime (ISO 8601)"
}
```

### Category

```json
{
  "id": "uuid",
  "name": "string",
  "icon": "string",
  "color": "string (hex)"
}
```

---

## Request/Response Examples

### POST /subscriptions
**Request:**
```json
{
  "name": "Netflix",
  "price": 15.99,
  "currency": "EUR",
  "billingCycle": "monthly",
  "categoryId": "cat-streaming",
  "nextBillingDate": "2026-03-14",
  "notes": "Standard plan"
}
```

**Response (201):**
```json
{
  "id": "generated-uuid",
  "name": "Netflix",
  "price": 15.99,
  "currency": "EUR",
  "billingCycle": "monthly",
  "categoryId": "cat-streaming",
  "nextBillingDate": "2026-03-14",
  "notes": "Standard plan",
  "isActive": true,
  "createdAt": "2026-02-14T16:00:00.000Z",
  "updatedAt": "2026-02-14T16:00:00.000Z"
}
```

---

## Validatie Regels (server-side)

| Veld | Regels |
|------|--------|
| name | Verplicht, max 100 chars |
| price | Verplicht, >= 0, <= 999999.99 |
| currency | Verplicht, ISO 4217 (EUR, USD, …) |
| billingCycle | Verplicht, enum: monthly, quarterly, yearly |
| categoryId | Verplicht, moet bestaande category zijn |
| nextBillingDate | Optioneel, geldige ISO date |
| notes | Optioneel, max 500 chars |

---

## Authenticatie (Fase 2)

- **Header**: `Authorization: Bearer <JWT>`
- **Scope**: Alle endpoints vereisen auth (behalve login/register)
- **Data isolatie**: Subscriptions per user (tenant)

---

*Alex — Architect — API Contract*
