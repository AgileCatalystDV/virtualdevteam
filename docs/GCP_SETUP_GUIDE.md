# GCP Setup Guide — Subscription Tracker

**Auteur**: Ian (DevSecOps)  
**Datum**: 2026-02-15  
**Doel**: Handmatige setup door Lead PM — copy-paste vriendelijk

---

## Dev setup (lokaal experimenteren)

**Voor lokaal testen zonder GCP**: Zie [DEV_SETUP.md](./DEV_SETUP.md) — Docker of localhost Postgres.

---

## Pre-requisites (GCP)

| Item | Actie |
|------|-------|
| **Google Cloud account** | [console.cloud.google.com](https://console.cloud.google.com) |
| **Billing** | Inschakelen op project (free tier volstaat voor start) |
| **gcloud CLI** | `brew install google-cloud-sdk` of [installer](https://cloud.google.com/sdk/docs/install) |
| **Cloud SQL Proxy** | Voor migratie: `brew install cloud-sql-proxy` of [download](https://cloud.google.com/sql/docs/postgres/connect-auth-proxy#install) |

```bash
# Check installatie
gcloud --version
cloud_sql_proxy --version
```

---

## Stap 0: Project & APIs

```bash
# 1. Project kiezen (vervang JOUW_PROJECT_ID)
gcloud config set project JOUW_PROJECT_ID

# 2. APIs inschakelen
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com
```

---

## Stap 1: Cloud SQL Instance

```bash
# Instance aanmaken (europe-west1 = België, GDPR)
gcloud sql instances create subscription-tracker-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=europe-west1

# Als db-f1-micro niet beschikbaar: gebruik db-g1-small
# --tier=db-g1-small
```

**Database + user** (via Console of gcloud):

```bash
# Database aanmaken
gcloud sql databases create subscription_tracker --instance=subscription-tracker-db

# Wachtwoord genereren (bewaar dit!)
openssl rand -base64 24

# Postgres user wachtwoord (voor migratie)
gcloud sql users set-password postgres \
  --instance=subscription-tracker-db \
  --password=JOUW_GEGENEREERD_WACHTWOORD
```

**Optioneel (PenPeter aanbeveling)**: Na migratie een dedicated app user aanmaken. Voor eerste setup: postgres is oké; later `subscription_tracker_app` met beperkte rechten.

---

## Stap 2: Secret Manager

Vervang `PROJECT_ID`, `REGION`, `INSTANCE`, `WACHTWOORD`:

```bash
# Connection string (Unix socket voor Cloud Run)
# Format: postgresql://USER:PASSWORD@/DATABASE?host=/cloudsql/PROJECT:REGION:INSTANCE
CONN="postgresql://postgres:JOUW_WACHTWOORD@/subscription_tracker?host=/cloudsql/JOUW_PROJECT_ID:europe-west1:subscription-tracker-db"

echo -n "$CONN" | gcloud secrets create db-url --data-file=-
```

**Let op**: Geen wachtwoord in git of logs. Gebruik een sterk wachtwoord (min. 16 chars).

---

## Stap 3: Migratie (schema uitvoeren)

```bash
# 1. Cloud SQL Proxy starten (in aparte terminal)
cloud_sql_proxy -instances=JOUW_PROJECT_ID:europe-west1:subscription-tracker-db=tcp:5432

# 2. Migratie uitvoeren (proxy moet draaien)
export DATABASE_URL="postgresql://postgres:JOUW_WACHTWOORD@localhost:5432/subscription_tracker"
psql "$DATABASE_URL" -f migrations/001_initial_schema.sql

# 3. Validatie
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM categories;"
# Verwacht: 11 rijen
```

---

## Stap 4: API deployen (Cloud Run)

```bash
cd api-backend

gcloud run deploy subscription-tracker-api \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances JOUW_PROJECT_ID:europe-west1:subscription-tracker-db \
  --set-secrets DATABASE_URL=db-url:latest
```

**IAM**: Als deploy faalt met "permission denied" op secret:
- Ga naar GCP Console → IAM
- Cloud Run service account (default: `PROJECT_NUMBER-compute@developer.gserviceaccount.com`) 
- Voeg toe: `Secret Manager Secret Accessor` voor secret `db-url`

**Validatie**:
```bash
# Noteer de URL uit de deploy output (bijv. https://subscription-tracker-api-xxx.run.app)
curl https://JOUW_API_URL/v1/categories
# Verwacht: JSON met 11 categories
```

---

## Stap 5: Frontend configureren

**Vercel** (aanbevolen voor Next.js):
1. `vercel --prod` in `subscription-tracker/`
2. Environment variable: `NEXT_PUBLIC_API_URL` = `https://JOUW_API_URL/v1`

**Cloud Run** (alles in GCP):
- Vereist Dockerfile + `output: 'standalone'` in next.config
- Zie [DEPLOYMENT_GCP.md](./DEPLOYMENT_GCP.md) Fase 4

---

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| `db-f1-micro` niet beschikbaar | Gebruik `--tier=db-g1-small` |
| "Permission denied" op secret | IAM: Cloud Run SA → Secret Manager Secret Accessor |
| "Connection refused" bij deploy | Check `--add-cloudsql-instances` (exact format: `PROJECT:REGION:INSTANCE`) |
| Migratie: "connection refused" | Cloud SQL Proxy moet draaien op localhost:5432 |
| CORS errors in browser | Backend: beperk `cors({ origin: ['https://jouw-frontend.vercel.app'] })` |

---

## Volgorde (samenvatting)

1. Project + APIs
2. Cloud SQL instance + database + wachtwoord
3. Secret Manager (db-url)
4. Migratie (proxy + psql)
5. API deploy (Cloud Run)
6. Frontend (Vercel of Cloud Run)

---

## Referenties

- [DEV_SETUP.md](./DEV_SETUP.md) — Lokaal ontwikkelen (Docker of localhost)
- [GCP_ARCHITECTURE.md](./GCP_ARCHITECTURE.md) — Waarom deze architectuur
- [DEPLOYMENT_GCP.md](./DEPLOYMENT_GCP.md) — Technische details
- [SECURITY_REVIEW_GCP_DATABASE.md](./SECURITY_REVIEW_GCP_DATABASE.md) — Security checklist

---

*Ian — DevSecOps — GCP Setup Guide*
