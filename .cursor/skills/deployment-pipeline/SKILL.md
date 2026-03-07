---
name: deployment-pipeline
description: 'Ian (DevSecOps): CI/CD voor GCP — Cloud Run, GitHub Actions, gcloud. Use when setting up or changing deployment pipelines.'
---

# Deployment Pipeline Skill (GCP)

## Doel
Veilige, herhaalbare deploy van code naar Google Cloud. **Project**: Cloud Run (API + Frontend), Cloud SQL, Secret Manager.

## Wanneer te activeren
- Nieuwe deployment pipeline opzetten
- GitHub Actions workflow toevoegen of wijzigen
- Cloud Run deploy configureren
- CI/CD na handmatige deploy valideren

## Project-specifiek: GCP All The Way

### Stack
- **API**: Express → Cloud Run (`subscription-tracker-api`)
- **Frontend**: Next.js standalone → Cloud Run (`subscription-tracker-web`)
- **Database**: Cloud SQL (PostgreSQL)
- **Secrets**: Secret Manager (`db-url`)

### Volgorde (niet overslaan)
1. Infrastructuur (Cloud SQL, Secret Manager, Artifact Registry)
2. Migratie uitvoeren
3. API deployen (met `--add-cloudsql-instances`, `--set-secrets`)
4. Frontend deployen (met `NEXT_PUBLIC_API_URL`)

### GitHub Actions (na handmatige deploy)
- **Trigger**: push naar `main`
- **Auth**: `GCP_SA_KEY` (service account JSON) of Workload Identity Federation
- **Jobs**: deploy-api → deploy-frontend (needs)
- **Geen staging** in v1 — main = productie

### gcloud run deploy (API)
```bash
gcloud run deploy subscription-tracker-api \
  --source ./api-backend \
  --region europe-west1 \
  --add-cloudsql-instances PROJECT:REGION:INSTANCE \
  --set-secrets DATABASE_URL=db-url:latest
```

### gcloud run deploy (Frontend)
```bash
gcloud run deploy subscription-tracker-web \
  --source ./subscription-tracker \
  --region europe-west1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://api-url/v1
```

## Security
- Geen secrets in code — Secret Manager
- GitHub Secrets voor `GCP_SA_KEY`
- CORS: beperk tot frontend Cloud Run URL

## References
- [docs/GCP_DEPLOYMENT_STEPS.md](../../docs/GCP_DEPLOYMENT_STEPS.md)
- [docs/DEPLOYMENT_GCP.md](../../docs/DEPLOYMENT_GCP.md)
- [docs/LEAD_PM_GCP_STAPPENPLAN.md](../../docs/LEAD_PM_GCP_STAPPENPLAN.md)
