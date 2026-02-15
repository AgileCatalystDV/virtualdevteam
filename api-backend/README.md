# Subscription Tracker API

Express backend voor Cloud Run. Zelfde contract als mock API.

## Lokaal draaien

```bash
# Database nodig — gebruik Cloud SQL proxy of lokale PostgreSQL
export DATABASE_URL="postgresql://user:pass@localhost:5432/subscription_tracker"

npm install
npm run dev
```

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
