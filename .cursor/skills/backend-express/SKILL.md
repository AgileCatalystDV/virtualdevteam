---
name: backend-express
description: 'Floyd: Express 5 + Cloud SQL patterns. Use when building API routes, database access, or migrations.'
---

# Backend Express Skill

## Wanneer te gebruiken
- API routes bouwen of wijzigen
- Database queries (PostgreSQL)
- Migraties schrijven of uitvoeren
- Auth middleware

## Stack (Subscription Tracker)
- **Express 5** — `app.use(express.json())`, route handlers
- **pg** — PostgreSQL client, connection pool
- **Cloud SQL** — Unix socket in productie, TCP via proxy lokaal

## Database (db.js)
- **Connection**: `DATABASE_URL` uit env (Secret Manager in Cloud Run)
- **Unix socket**: `host=/cloudsql/PROJECT:REGION:INSTANCE` — geen SSL
- **Public IP**: `ssl: { rejectUnauthorized: true }` in productie
- **Pool**: `pg.Pool` — connection per request, `client.release()` in finally

## Queries
- **Altijd** parameterized: `pool.query('SELECT * FROM x WHERE id = $1', [id])`
- Geen string concatenatie in SQL — SQL injection preventie

## Migraties
- `migrations/001_initial_schema.sql`, `002_mock_user.sql`
- Volgorde: 001 → 002
- Lokaal: `psql` of `docker compose exec -i db psql ...`
- Cloud: Cloud SQL Proxy + psql

## Auth
- `authMiddleware`: leest `Authorization: Bearer <token>`
- Mock: `AUTH_MODE=mock` → `mock-dev-token` → mock user UUID
- Productie: Firebase Admin SDK `verifyIdToken()`

## References
- [api-backend/src/db.js](../../api-backend/src/db.js)
- [docs/architecture/API_CONTRACT.md](../../docs/architecture/API_CONTRACT.md)
- [docs/architecture/MOCK_TO_GCP_MIGRATION.md](../../docs/architecture/MOCK_TO_GCP_MIGRATION.md)
