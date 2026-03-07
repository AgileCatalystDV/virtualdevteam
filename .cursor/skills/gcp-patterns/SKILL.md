---
name: gcp-patterns
description: Provides GCP patterns for Cloud Run, Cloud SQL, Secret Manager. Use when setting up or troubleshooting GCP infrastructure, deploying to Cloud Run, or configuring database connections.
---

# GCP Patterns (Cloud Run + Cloud SQL + Secret Manager)

## Description

Subscription Tracker uses Cloud Run (API), Cloud SQL (PostgreSQL), Secret Manager (credentials). Regio: `europe-west1` (GDPR).

## Instructions

1. **Cloud SQL**
   - Instance: `db-f1-micro` of `db-g1-small` (als micro niet beschikbaar)
   - Connection: Unix socket voor Cloud Run — `host=/cloudsql/PROJECT:REGION:INSTANCE`
   - Migratie: Cloud SQL Proxy lokaal → `psql` tegen localhost:5432

2. **Secret Manager**
   - Secret `db-url`: connection string in Unix socket format
   - Cloud Run: `--set-secrets DATABASE_URL=db-url:latest`
   - IAM: Cloud Run SA moet `Secret Manager Secret Accessor` hebben

3. **Cloud Run**
   - `--add-cloudsql-instances PROJECT:REGION:INSTANCE` (exact format)
   - `--set-secrets` voor credentials
   - Regio: `europe-west1`

4. **Connection string format**
   - Cloud Run: `postgresql://user:pass@/dbname?host=/cloudsql/PROJECT:REGION:INSTANCE`
   - Lokaal (proxy): `postgresql://user:pass@localhost:5432/dbname`

5. **Frontend (Next.js)**
   - Dockerfile + `output: 'standalone'` in next.config
   - `gcloud run deploy subscription-tracker-web --source .`
   - Build-time: `NEXT_PUBLIC_API_URL` (API URL + `/v1`)

6. **Artifact Registry**
   - APIs: `artifactregistry.googleapis.com`
   - `--source .` gebruikt Cloud Build → push naar Artifact Registry automatisch

## Troubleshooting

| Probleem | Oplossing |
|----------|-----------|
| db-f1-micro niet beschikbaar | `--tier=db-g1-small` |
| Permission denied op secret | IAM: SA → Secret Manager Secret Accessor |
| Connection refused bij deploy | Check `--add-cloudsql-instances` format |
| Migratie: connection refused | Cloud SQL Proxy moet draaien |
| CORS errors | Backend: `cors({ origin: ['https://frontend-url'] })` |

## References

- [docs/LEAD_PM_GCP_STAPPENPLAN.md](../../docs/LEAD_PM_GCP_STAPPENPLAN.md) — Start voor Lead PM (geen ervaring)
- [docs/GCP_SETUP_GUIDE.md](../../docs/GCP_SETUP_GUIDE.md)
- [docs/GCP_DEPLOYMENT_STEPS.md](../../docs/GCP_DEPLOYMENT_STEPS.md)
- [docs/SECURITY_REVIEW_GCP_DATABASE.md](../../docs/SECURITY_REVIEW_GCP_DATABASE.md)
