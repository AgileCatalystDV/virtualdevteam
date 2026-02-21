# Subscription Tracker API

Express backend voor Cloud Run. Zelfde contract als mock API.

## Lokaal draaien (dev)

**Optie 1 — Docker** (aanbevolen):
```bash
# Terminal 1: database
docker compose up -d
psql "postgresql://postgres:postgres@localhost:5432/subscription_tracker" -f ../migrations/001_initial_schema.sql

# Terminal 2: API
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subscription_tracker"
npm install && npm run dev
```

**Optie 2 — Localhost Postgres**:
```bash
export DATABASE_URL="postgresql://user:pass@localhost:5432/subscription_tracker"
npm install && npm run dev
```

Zie [docs/DEV_SETUP.md](../docs/DEV_SETUP.md) voor volledige dev setup (Docker + localhost).

API op http://localhost:8080

- GET /v1/categories
- GET /v1/subscriptions
- POST /v1/subscriptions
- etc.

## Cloud Run deploy

```bash
gcloud run deploy subscription-tracker-api \
  --source . \
  --region europe-west1 \
  --set-env-vars DATABASE_URL="$(gcloud secrets versions access latest --secret=db-url)"
```

## Migratie

Run `migrations/001_initial_schema.sql` op Cloud SQL.
