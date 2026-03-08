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

### Frontend deploy (cloudbuild — NEXT_PUBLIC_API_URL bij build time)
```bash
cd subscription-tracker
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_API_URL=https://subscription-tracker-api-xxx.run.app/v1
```
**Let op**: `--set-env-vars` werkt niet voor `NEXT_PUBLIC_*` — Next.js bakt die in bij build. Gebruik cloudbuild met `--build-arg`.

## Git commit (wanneer agent niet kan committen)
Als `git commit` faalt met `error: unknown option 'trailer'`: lokale git-config. **Workaround**: geef Lead PM de commando's om handmatig te runnen in terminal: `git add -A && git commit -m "message"`. Zie [DEV_SETUP.md](../../docs/setup/DEV_SETUP.md) Troubleshooting.

## Security
- Geen secrets in code — Secret Manager
- GitHub Secrets voor `GCP_SA_KEY`
- CORS: beperk tot frontend Cloud Run URL

## References
- [docs/setup/GCP_DEPLOYMENT_STEPS.md](../../docs/setup/GCP_DEPLOYMENT_STEPS.md)
- [docs/setup/DEPLOYMENT_GCP.md](../../docs/setup/DEPLOYMENT_GCP.md)
- [docs/setup/LEAD_PM_GCP_STAPPENPLAN.md](../../docs/setup/LEAD_PM_GCP_STAPPENPLAN.md)
