# QA Review — Cloud DB Voorbereiding (Sprint 5)

**Reviewer**: Maya (QA Engineer)  
**Datum**: 2026-02-14  
**Scope**: migrations, api-backend, API contract compliance

---

## Samenvatting

De Cloud DB-voorbereiding is **goed gestructureerd** en sluit aan op het API-contract. Er zijn geen blocking issues. Enkele suggestions voor robuustheid en API-contract compliance.

---

## Wat goed gaat

- **Schema**: Duidelijke structuur (users, categories, subscriptions), FK's correct, indexes op user_id en category_id
- **API contract**: Response format (camelCase) komt overeen met contract; endpoints GET/POST/PUT/DELETE aanwezig
- **DB mapping**: rowToSubscription mapt snake_case → camelCase correct
- **Error handling**: Try/catch met 500, 404 waar van toepassing
- **Seed data**: Categories identiek aan mock (11 categorieën)
- **Dockerfile**: Eenvoudig, Node 20-slim, geschikt voor Cloud Run

---

## Suggestions (niet blocking)

### 1. API Backend — Input validatie (API Contract)

| Veld | Contract | Huidige backend | Suggestie |
|------|----------|-----------------|-----------|
| name | max 100 chars | Geen check | Valideer vóór INSERT/UPDATE; return 400 bij overschrijding |
| price | 0–999999.99 | Alleen DB CHECK | Valideer in code; return 400 met duidelijke foutmelding |
| billingCycle | monthly/quarterly/yearly | Geen check | Valideer enum; return 400 bij ongeldige waarde |
| categoryId | Moet bestaan | Alleen FK (→ 500) | Check category existence; return 400 "Categorie niet gevonden" |
| notes | max 500 chars | Geen check | Valideer; return 400 |

**Impact**: Zonder validatie leidt foute input tot DB-fouten en generieke 500. Beter: expliciete 400 met foutmelding.

### 2. API Backend — DATABASE_URL bij startup

**Huidige situatie**: Pool wordt aangemaakt zonder check. Eerste query faalt als `DATABASE_URL` ontbreekt.

**Suggestie**: Bij startup een health-check query uitvoeren (bijv. `SELECT 1`). Bij falen: log duidelijke fout en exit(1). Cloud Run herstart dan de container.

### 3. Migration — Idempotentie (optioneel)

**Huidige situatie**: Tweede run van `001_initial_schema.sql` faalt op `CREATE TABLE`.

**Suggestie**: Voor dev/test: `CREATE TABLE IF NOT EXISTS` of apart script voor "drop + recreate". Voor productie: éénmalige run is voldoende.

### 4. GET /subscriptions — Filter is_active

**Huidige situatie**: Backend filtert `is_active = true`. Mock retourneert alle subscriptions (frontend filtert).

**Impact**: Laag. Frontend filtert ook. Als later "archived" view komt, kan filter worden aangepast.

**Geen actie** voor nu.

### 5. Categories ORDER BY

**Huidige situatie**: Backend gebruikt `ORDER BY name`; mock heeft vaste volgorde.

**Impact**: Alleen volgorde in response wijzigt. Frontend is order-agnostisch.

**Geen actie** nodig.

---

## API Contract Compliance

| Endpoint | Contract | Backend | Status |
|----------|----------|---------|--------|
| GET /subscriptions | Lijst, gefilterd op user | ✅ | OK |
| GET /subscriptions/:id | Eén item, 404 indien niet gevonden | ✅ | OK |
| POST /subscriptions | 201, nieuw object | ✅ | OK |
| PUT /subscriptions/:id | Update, 404 indien niet gevonden | ✅ | OK |
| DELETE /subscriptions/:id | 200, 404 indien niet gevonden | ✅ | OK |
| GET /categories | Lijst | ✅ | OK |
| GET /categories/:id | *(Fase 2+)* | ❌ Niet geïmplementeerd | OK voor MVP |

---

## Schema Review

| Tabel | Veld | Type | Opmerking |
|-------|------|------|------------|
| users | firebase_uid | VARCHAR(128) | Voldoende voor Firebase UID |
| categories | id | VARCHAR(50) | Past bij "cat-streaming" etc. |
| subscriptions | price | DECIMAL(12,2) + CHECK | Contract compliant |
| subscriptions | notes | TEXT | Geen max; contract zegt 500 — overweeg CHECK |
| subscriptions | category_id | FK categories | ✅ |

**Optioneel**: `CHECK (length(notes) <= 500)` op subscriptions voor contract compliance.

---

## Aanbeveling

**Geen blocking issues.** De voorbereiding is geschikt voor Cloud SQL + Cloud Run.

**Aanbevolen voor productie** (P1, niet blokkerend):
1. Input validatie in POST/PUT (name length, price range, billingCycle enum, categoryId existence, notes length)
2. Startup check op DATABASE_URL / DB connectie

---

*Maya — QA Engineer — Cloud DB Voorbereiding Review*
