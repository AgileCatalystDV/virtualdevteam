# Dev Setup — Lokale database voor experimenteren/testen

**Auteur**: Ian (DevSecOps)  
**Datum**: 2026-02-15  
**Doel**: Lokaal ontwikkelen en testen zonder GCP

---

## Opties

| Optie | Wanneer | Vereisten |
|-------|---------|-----------|
| **A. Docker** | Snelste start, geïsoleerd | Docker Desktop |
| **B. Localhost** | Geen Docker, native Postgres | PostgreSQL (brew/system) |

---

## Optie A: Docker (aanbevolen)

### 1. Database starten

```bash
# In project root
docker compose up -d

# Schema wordt automatisch toegepast bij eerste start (zie docker-compose.yml)
# Check: container draait
docker compose ps

# Validatie (optioneel)
docker compose exec db psql -U postgres -d subscription_tracker -c "SELECT COUNT(*) FROM categories;"
# Verwacht: 11
```

### 2. Migratie handmatig (alleen als nodig)

Bij **eerste keer** of **verse volume** (`docker compose down -v` gevolgd door `up`) draait het schema automatisch via `docker-entrypoint-initdb.d`.

Handmatig nodig als je een bestaande container had vóór deze setup:

```bash
docker compose exec -i db psql -U postgres -d subscription_tracker < migrations/001_initial_schema.sql
docker compose exec -i db psql -U postgres -d subscription_tracker < migrations/002_mock_user.sql
```

### 3. API starten

```bash
cd api-backend
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subscription_tracker"
export AUTH_MODE=mock   # Optioneel: voor Dev login flow
npm install
npm run dev
```

API op http://localhost:8080

### 4. Frontend starten

```bash
cd subscription-tracker
export NEXT_PUBLIC_API_URL="http://localhost:8080/v1"
export NEXT_PUBLIC_AUTH_MODE=mock   # Optioneel: toont "Dev login" knop
npm run dev
```

Frontend op http://localhost:3000

### 5. Mock login (optioneel)

Met `AUTH_MODE=mock` (api-backend) en `NEXT_PUBLIC_AUTH_MODE=mock` (frontend):
- Login pagina toont **"Dev login (mock)"** knop
- Klik → ingelogd als dev user, data per user
- Geen Firebase nodig voor lokale dev

### Stoppen

```bash
docker compose down
# Data behouden: docker compose down (volume blijft)
# Alles wissen: docker compose down -v
```

### Persistentie & herstart

| Actie | Data |
|-------|------|
| `docker compose down` | **Blijft** — volume blijft op disk |
| PC herstart | **Blijft** — volumes overleven herstart |
| `docker compose up -d` (na down/herstart) | Data is er nog |

### Reset naar verse staat (safestate)

Verse DB met schema + seed data (11 categories):

```bash
docker compose down -v && docker compose up -d
```

Of via Makefile: `make db-reset`

---

## Optie B: Localhost (zonder Docker)

### 1. PostgreSQL installeren

**macOS (Homebrew)**:
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Of**: [postgresql.org/download](https://www.postgresql.org/download/)

### 2. Database + schema

```bash
# Database aanmaken (postgres user = je systeem user, of expliciet)
createdb subscription_tracker

# Migratie
psql -d subscription_tracker -f migrations/001_initial_schema.sql
psql -d subscription_tracker -f migrations/002_mock_user.sql

# Validatie
psql -d subscription_tracker -c "SELECT COUNT(*) FROM categories;"
```

**Met wachtwoord** (als je postgres user met wachtwoord hebt):
```bash
export DATABASE_URL="postgresql://postgres:JOUW_WACHTWOORD@localhost:5432/subscription_tracker"
psql "$DATABASE_URL" -f migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f migrations/002_mock_user.sql
```

### 3. API + Frontend

Zelfde als Optie A, stap 3–4. Pas `DATABASE_URL` aan naar jouw localhost setup.

---

## Environment variables (dev)

| Var | Waarde | Beschrijving |
|-----|--------|--------------|
| **DATABASE_URL** (API) | `postgresql://postgres:postgres@localhost:5432/subscription_tracker` | Postgres connection string |
| **NEXT_PUBLIC_API_URL** (Frontend) | `http://localhost:8080/v1` | API base URL |
| **AUTH_MODE** (API) | `mock` | Optioneel — Dev login zonder Firebase |
| **NEXT_PUBLIC_AUTH_MODE** (Frontend) | `mock` | Optioneel — toont "Dev login (mock)" knop |

**Tip**: Maak `.env.local` in subscription-tracker en `api-backend/.env` (niet committen).

---

## Overzicht

```
[Dev]                          [Productie]
Docker Postgres / localhost  →  Cloud SQL
API (npm run dev)            →  Cloud Run
Frontend (npm run dev)       →  Cloud Run
```

Dezelfde migrations en API code werken in beide omgevingen. Alleen `DATABASE_URL` wijzigt.

---

## GCP deploy (handmatig)

Voor productie-deploy naar Google Cloud:

1. **Stappenplan**: [GCP_DEPLOYMENT_STEPS.md](./GCP_DEPLOYMENT_STEPS.md) — volgorde en checklist
2. **Volledige instructies**: [DEPLOYMENT_GCP.md](./DEPLOYMENT_GCP.md) — gcloud commands, env vars, CI/CD voorstel
3. **Pre-deploy checklist**: Zie GCP_DEPLOYMENT_STEPS.md

---

## Troubleshooting

| Probleem | Oplossing |
|---------|-----------|
| `psql: command not found` | Gebruik **Optie 2b** (docker exec) — geen psql nodig op je Mac. Of: `brew install libpq` en `export PATH="/opt/homebrew/opt/libpq/bin:$PATH"` |
| Docker container start niet | `docker compose up -d` opnieuw; check met `docker compose ps` |
| Poort 5432 in gebruik | Stop lokale Postgres: `brew services stop postgresql@16` of wijzig poort in docker-compose |

---

## Referenties

- [LEAD_PM_GCP_STAPPENPLAN.md](./LEAD_PM_GCP_STAPPENPLAN.md) — **Start hier** — Simpel stappenplan voor GCP (Lead PM)
- [GCP_DEPLOYMENT_STEPS.md](./GCP_DEPLOYMENT_STEPS.md) — GCP all the way stappenplan
- [DEPLOYMENT_GCP.md](./DEPLOYMENT_GCP.md) — Productie setup (gcloud commands)
- [MOCK_LOGIN.md](./MOCK_LOGIN.md) — Mock login flow (lokaal zonder Firebase)
- [migrations/001_initial_schema.sql](../migrations/001_initial_schema.sql)
- [migrations/002_mock_user.sql](../migrations/002_mock_user.sql)

---

*Ian — DevSecOps — Dev Setup*  
*Mock login doc — Floyd, Fede — 2026-02-22*
