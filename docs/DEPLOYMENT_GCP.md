# Deployment — Google Cloud (Subscription Tracker)

**Auteur**: Ian (DevSecOps)  
**Datum**: 2026-02-14  
**Context**: Volledige deployment-strategie voor GCP-infrastructuur

---

## Projectoverzicht

```
virtualdevteam/
├── subscription-tracker/     # Next.js frontend (UI + mock API)
├── api-backend/              # Express API (Cloud Run)
├── migrations/               # PostgreSQL schema
├── crud-app/                 # Demo app (niet in scope)
└── docs/
```

**Te deployen**:
- **Frontend**: subscription-tracker (Next.js)
- **API**: api-backend (Express)
- **Database**: Cloud SQL PostgreSQL

---

## Architectuur (GCP)

```mermaid
flowchart TB
    subgraph GCP [Google Cloud - europe-west1]
        subgraph run [Cloud Run]
            FE[Frontend Next.js]
            API[API Express]
        end
        DB[(Cloud SQL PostgreSQL)]
        SM[Secret Manager]
    end
    User[Gebruikers] -->|HTTPS| FE
    FE -->|NEXT_PUBLIC_API_URL| API
    API -->|DATABASE_URL| DB
    API --> SM
    SM -->|db-url| API
```

---

## Deployment Opties

### Optie A: Alles op Cloud Run (aanbevolen)

| Component | Service | Voordeel |
|-----------|---------|----------|
| Frontend | Cloud Run | Alles in GCP, één factuur, VPC-consistent |
| API | Cloud Run | Serverless, schaal naar nul |
| Database | Cloud SQL | Beheerd PostgreSQL |

### Optie B: Vercel + Cloud Run

| Component | Service | Voordeel |
|-----------|---------|----------|
| Frontend | Vercel | Eenvoudigste Next.js deploy, edge, gratis tier |
| API | Cloud Run | Zelfde als A |
| Database | Cloud SQL | Zelfde als A |

**Trade-off**: Vercel = snelle setup, maar frontend en API op verschillende platforms. CORS moet correct staan.

---

## Wat ontbreekt (te implementeren)

| Item | Status | Actie |
|------|--------|-------|
| Frontend Dockerfile | Ontbreekt | Maak Dockerfile voor Next.js (standalone output) |
| GitHub Actions CI/CD | Ontbreekt | Workflow: build → push Artifact Registry → deploy Cloud Run |
| Cloud Build | Ontbreekt | cloudbuild.yaml voor gcloud builds submit |
| Secret Manager setup | Handmatig | db-url secret aanmaken |
| Cloud SQL instance | Handmatig | Instance + database aanmaken |
| Migratie script | Deels | migrations/001 bestaat; run-script ontbreekt |

---

## Stap-voor-stap Deployment

### Fase 1: Infrastructuur (eenmalig)

```bash
# 1. GCP project + APIs
gcloud config set project JOUW_PROJECT_ID
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com

# 2. Artifact Registry (voor Docker images)
gcloud artifacts repositories create subscription-tracker --repository-format=docker --location=europe-west1

# 3. Cloud SQL instance
gcloud sql instances create subscription-tracker-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=europe-west1

# 4. Database + user
gcloud sql databases create subscription_tracker --instance=subscription-tracker-db
# Wachtwoord instellen via Console of:
# gcloud sql users set-password postgres --instance=subscription-tracker-db --password=GEHEIM

# 5. Secret Manager
echo -n "postgresql://user:pass@/subscription_tracker?host=/cloudsql/PROJECT:REGION:INSTANCE" | \
  gcloud secrets create db-url --data-file=-
```

**Cloud SQL connection**: Voor Cloud Run moet je **Cloud SQL Connector** of **Unix socket** gebruiken. Connection string voor Cloud Run:

```
postgresql://user:pass@/subscription_tracker?host=/cloudsql/PROJECT_ID:europe-west1:subscription-tracker-db
```

### Fase 2: Migratie uitvoeren

```bash
# Via Cloud SQL Proxy (lokaal)
cloud_sql_proxy -instances=PROJECT_ID:europe-west1:subscription-tracker-db=tcp:5432 &
psql "postgresql://user:pass@localhost:5432/subscription_tracker" -f migrations/001_initial_schema.sql
```

### Fase 3: API deployen

```bash
cd api-backend
gcloud run deploy subscription-tracker-api \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances PROJECT_ID:europe-west1:subscription-tracker-db \
  --set-secrets DATABASE_URL=db-url:latest
```

**Let op**: `DATABASE_URL` moet het Unix socket format gebruiken voor Cloud SQL. Secret Manager waarde:

```
postgresql://user:pass@/subscription_tracker?host=/cloudsql/PROJECT_ID:europe-west1:subscription-tracker-db
```

### Fase 4: Frontend deployen

**Optie 4a — Cloud Run** (vereist Dockerfile):

```dockerfile
# subscription-tracker/Dockerfile
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 8080
CMD ["node", "server.js"]
```

Next.js config moet `output: 'standalone'` hebben.

```bash
cd subscription-tracker
gcloud run deploy subscription-tracker-web \
  --source . \
  --region europe-west1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://subscription-tracker-api-xxx.run.app/v1
```

**Optie 4b — Vercel**:

```bash
cd subscription-tracker
vercel --prod
# In Vercel dashboard: Environment variables
# NEXT_PUBLIC_API_URL = https://subscription-tracker-api-xxx.run.app/v1
```

---

## Environment Variables

### Frontend (build-time)

| Var | Beschrijving | Voorbeeld |
|-----|--------------|-----------|
| NEXT_PUBLIC_API_URL | API base URL | `https://api.xxx.run.app/v1` |
| NEXT_PUBLIC_FIREBASE_API_KEY | Firebase (optioneel) | — |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Firebase | — |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Firebase | — |

### API (runtime)

| Var | Beschrijving | Bron |
|-----|--------------|------|
| DATABASE_URL | PostgreSQL connection string | Secret Manager |
| PORT | Cloud Run injecteert 8080 | — |

---

## CI/CD — GitHub Actions (voorstel)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GCP

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/setup-gcloud@v2
      - run: |
          gcloud run deploy subscription-tracker-api \
            --source ./api-backend \
            --region europe-west1 \
            --platform managed
  deploy-frontend:
    needs: deploy-api
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ... idem voor frontend
```

**Secrets**: `GCP_SA_KEY` = service account JSON met rechten voor Cloud Run, Artifact Registry, Secret Manager.

---

## Security Checklist

| Item | Status |
|------|--------|
| Geen secrets in code | ✅ |
| Secret Manager voor DATABASE_URL | Te configureren |
| Cloud Run: least privilege IAM | Te configureren |
| CORS: alleen frontend origin | API: cors() nu open — beperk in productie |
| HTTPS only | ✅ Cloud Run default |
| Regio europe-west1 (GDPR) | Te kiezen bij deploy |

---

## Kosten (indicatief, laag traffic)

| Service | Geschat/maand |
|---------|---------------|
| Cloud Run (API + Frontend) | €0–5 |
| Cloud SQL db-f1-micro | €0–15 |
| Secret Manager | €0–1 |
| **Totaal** | **€0–25** |

---

## Aanbevelingen Ian

1. **Start met handmatige deploy** — Eerst API + Frontend één keer handmatig deployen om de flow te valideren.
2. **Frontend Dockerfile** — Toevoegen met `output: 'standalone'` in next.config.
3. **CI/CD** — GitHub Actions workflow na succesvolle handmatige deploy.
4. **Health check** — API heeft `/` health endpoint. Cloud Run gebruikt dit automatisch.
5. **CORS** — Beperk `cors({ origin: ['https://jouw-frontend.run.app'] })` in productie.

---

*Ian — DevSecOps — GCP Deployment Strategie*
