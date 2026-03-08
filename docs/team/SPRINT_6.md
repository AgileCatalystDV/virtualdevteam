# Sprint 6 — GCP Deploy (Lead PM aan het werk)

**Co-PM Intelligence** — Aansturing  
**Status**: ✅ Afgerond  
**Focus**: Lead PM voert GCP deploy uit, stap voor stap. Team ondersteunt.

---

## 🎯 Sprint Doel

Subscription Tracker live op GCP. **Lead PM** doet het werk; Ian, Floyd, Maya ondersteunen bij elke fase.

---

## 📋 Fases — Checklist

| Fase | Wat | Lead PM doet | Team support | Status |
|------|-----|--------------|--------------|--------|
| **0** | Voorbereiding | Project, billing, gcloud CLI, APIs | @Ian: check na 0.4 | ⬜ |
| **1** | Cloud SQL | Instance aanmaken (db-g1-small, ENTERPRISE) | @Ian: commando's | ⬜ |
| **2** | Secret Manager | Database + wachtwoord + db-url secret | @Ian: connection string format | ⬜ |
| **3** | Migratie | Cloud SQL Proxy + psql, 001 + 002 | @Ian: proxy, @Floyd: schema validatie | ⬜ |
| **4** | API deployen | gcloud run deploy api-backend | @Ian: flags, @Floyd: health check | ⬜ |
| **5** | Frontend deployen | gcloud run deploy subscription-tracker | @Ian: NEXT_PUBLIC_API_URL | ⬜ |
| **6** | App live | — | @Maya: smoke test | ⬜ |

---

## Fase 0 — Voorbereiding

- [ X] GCP project aanmaken (noteer Project ID)
- [X] Billing inschakelen
- [X] gcloud CLI: `brew install --cask google-cloud-sdk` (+ PATH in .bashrc/.zshrc)
- [X] `gcloud auth login` + `gcloud config set project JOUW_PROJECT_ID`
- [X] APIs: `gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com`

**Checkpoint**: `gcloud auth list` — ingelogd? → @Ian valideert

---

## Fase 1 — Cloud SQL

- [X] Instance: `gcloud sql instances create subscription-tracker-db ...`
- [X] Wacht ~5–10 min

**Checkpoint**: Instance draait in Console → Fase 2

---

## Fase 2 — Secret Manager

- [X] Database: `gcloud sql databases create subscription_tracker`
- [X] Wachtwoord: `openssl rand -base64 24` (bewaar!)
- [X] User wachtwoord: `gcloud sql users set-password postgres ...`
- [X] Secret: `echo -n "$CONN" | gcloud secrets create db-url --data-file=-`

**Checkpoint**: Secret `db-url` bestaat → Fase 3

---

## Fase 3 — Migratie

- [X] psql: `brew install libpq` (+ PATH: Intel `/usr/local/opt/libpq/bin` of Apple Silicon `/opt/homebrew/opt/libpq/bin`)
- [X] Cloud SQL Proxy: `brew install cloud-sql-proxy`
- [X] ADC (eenmalig): `gcloud auth application-default login`
- [X] Proxy starten (aparte terminal): `cloud-sql-proxy PROJECT_ID:europe-west1:subscription-tracker-db`
- [X] Migratie: `psql "$DATABASE_URL" -f migrations/001_initial_schema.sql`
- [X] Migratie: `psql "$DATABASE_URL" -f migrations/002_mock_user.sql`
- [X] Validatie: `SELECT COUNT(*) FROM categories;` → 11

**Checkpoint**: 11 categories → Fase 4

---

## Fase 4 — API deployen

- [X] `cd api-backend`
- [X] `gcloud run deploy subscription-tracker-api --source . --region europe-west1 ...`
- [X] Noteer API URL
- [X] Validatie: `curl https://API_URL/v1/categories` → JSON met 11 items

**Checkpoint**: API live → Fase 5

---

## Fase 5 — Frontend deployen

- [X] `cd subscription-tracker`
- [X] `gcloud run deploy subscription-tracker-web --source . --set-env-vars NEXT_PUBLIC_API_URL=https://API_URL/v1`
- [X] Noteer frontend URL: https://subscription-tracker-web-761770841827.europe-west1.run.app

**Checkpoint**: Frontend live → Fase 6

---

## Fase 6 — Smoke test

- [X] @Maya: frontend laadt, categories laden (API 11 items OK)
- [X] Lead PM: smoke test geslaagd (anonieme flow)

---

## 📁 Referentie

- **Stappenplan**: [LEAD_PM_GCP_STAPPENPLAN.md](../setup/LEAD_PM_GCP_STAPPENPLAN.md)
- **Bonus (Auth)**: [SPRINT_7.md](./SPRINT_7.md) — Firebase verify + security quick wins
- **Copy-paste**: [GCP_SETUP_GUIDE.md](../setup/GCP_SETUP_GUIDE.md)
- **Troubleshooting**: [DEV_SETUP.md](../setup/DEV_SETUP.md) Troubleshooting

---

## 📢 Directieven

**@Lead PM** — Jij bent aan zet. Volg de fases. Bij vragen: @Ian of @Floyd.

**@Ian** — Beschikbaar voor gcloud commands, troubleshooting, connection strings.

**@Floyd** — Beschikbaar voor schema validatie, API health check.

**@Maya** — Na Fase 5: smoke test uitvoeren.

---

*Co-PM Intelligence — Sprint 6 — GCP Deploy*
