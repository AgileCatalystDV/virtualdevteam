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
# Zonder psql op je Mac
docker compose exec -i db psql -U postgres -d subscription_tracker < migrations/001_initial_schema.sql
```

### 3. API starten

```bash
cd api-backend
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subscription_tracker"
npm install
npm run dev
```

API op http://localhost:8080

### 4. Frontend starten

```bash
cd subscription-tracker
export NEXT_PUBLIC_API_URL="http://localhost:8080/v1"
npm run dev
```

Frontend op http://localhost:3000

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

# Validatie
psql -d subscription_tracker -c "SELECT COUNT(*) FROM categories;"
```

**Met wachtwoord** (als je postgres user met wachtwoord hebt):
```bash
export DATABASE_URL="postgresql://postgres:JOUW_WACHTWOORD@localhost:5432/subscription_tracker"
psql "$DATABASE_URL" -f migrations/001_initial_schema.sql
```

### 3. API + Frontend

Zelfde als Optie A, stap 3–4. Pas `DATABASE_URL` aan naar jouw localhost setup.

---

## Environment variables (dev)

| Var | Docker | Localhost |
|-----|--------|-----------|
| **DATABASE_URL** (API) | `postgresql://postgres:postgres@localhost:5432/subscription_tracker` | `postgresql://user:pass@localhost:5432/subscription_tracker` |
| **NEXT_PUBLIC_API_URL** (Frontend) | `http://localhost:8080/v1` | `http://localhost:8080/v1` |

**Tip**: Maak `.env.local` in subscription-tracker en `api-backend/.env` (niet committen).

---

## Overzicht

```
[Dev]                          [Productie]
Docker Postgres / localhost  →  Cloud SQL
API (npm run dev)            →  Cloud Run
Frontend (npm run dev)       →  Vercel / Cloud Run
```

Dezelfde migrations en API code werken in beide omgevingen. Alleen `DATABASE_URL` wijzigt.

---

## Troubleshooting

| Probleem | Oplossing |
|---------|-----------|
| `psql: command not found` | Gebruik **Optie 2b** (docker exec) — geen psql nodig op je Mac. Of: `brew install libpq` en `export PATH="/opt/homebrew/opt/libpq/bin:$PATH"` |
| Docker container start niet | `docker compose up -d` opnieuw; check met `docker compose ps` |
| Poort 5432 in gebruik | Stop lokale Postgres: `brew services stop postgresql@16` of wijzig poort in docker-compose |

---

## Referenties

- [GCP_SETUP_GUIDE.md](./GCP_SETUP_GUIDE.md) — Productie setup
- [migrations/001_initial_schema.sql](../migrations/001_initial_schema.sql)

---

*Ian — DevSecOps — Dev Setup*
