---
name: dev-setup
description: Provides local dev workflow with Docker or localhost Postgres. Use when setting up dev environment, running API/frontend locally, or troubleshooting database connection.
---

# Dev Setup (Docker + Localhost)

## Description

Lokaal ontwikkelen zonder GCP. Zelfde migrations en API code als productie. Alleen `DATABASE_URL` wijzigt.

## Instructions

### Optie A: Docker (aanbevolen)

1. `docker compose up -d` (project root)
2. Migratie: `psql "postgresql://postgres:postgres@localhost:5432/subscription_tracker" -f migrations/001_initial_schema.sql`
3. API: `cd api-backend && DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subscription_tracker" npm run dev`
4. Frontend: `cd subscription-tracker && NEXT_PUBLIC_API_URL="http://localhost:8080/v1" npm run dev`

### Optie B: Localhost (zonder Docker)

1. `brew install postgresql@16` (of system package)
2. `createdb subscription_tracker`
3. `psql -d subscription_tracker -f migrations/001_initial_schema.sql`
4. API + Frontend: zelfde als A, pas `DATABASE_URL` aan

### Environment variables

| Var | Docker | Localhost |
|-----|--------|-----------|
| DATABASE_URL (API) | `postgresql://postgres:postgres@localhost:5432/subscription_tracker` | `postgresql://user:pass@localhost:5432/subscription_tracker` |
| NEXT_PUBLIC_API_URL (Frontend) | `http://localhost:8080/v1` | `http://localhost:8080/v1` |

**Tip**: `.env.local` / `api-backend/.env` — niet committen.

## Validatie

- Categories: `SELECT COUNT(*) FROM categories;` → 11
- API: `curl http://localhost:8080/v1/categories`
- Frontend: http://localhost:3000

## References

- [docs/DEV_SETUP.md](../../docs/DEV_SETUP.md)
- [docker-compose.yml](../../docker-compose.yml)
