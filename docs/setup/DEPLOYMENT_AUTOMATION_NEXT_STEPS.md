# Deployment Automatisatie — Next Steps (met Auth)

**Auteur**: Ian (DevSecOps)  
**Datum**: 2026-03-08  
**Context**: Na inbouw van Firebase Auth — wat moet er in CI/CD?

---

## 1. Huidige staat

- **Handmatige deploy**: API + Frontend via gcloud / cloudbuild
- **Geen** GitHub Actions workflow
- **Secrets**: db-url in Secret Manager; geen Firebase secrets nodig (ADC)

---

## 2. Wat verandert bij Auth (Firebase)

| Component | Nu | Met Auth |
|-----------|-----|----------|
| **API** | Geen Firebase config | Firebase Admin SDK — gebruikt **ADC** (Application Default Credentials) op Cloud Run. Geen extra env vars of secrets. |
| **Frontend** | NEXT_PUBLIC_API_URL | + NEXT_PUBLIC_FIREBASE_API_KEY, AUTH_DOMAIN, PROJECT_ID (build time) |
| **AUTH_MODE** | mock of undefined | productie: niet zetten (Firebase default); dev: mock |

**Belangrijk**: Firebase Admin SDK op Cloud Run gebruikt de **default compute service account**. Geen service account key nodig — GCP koppelt Firebase automatisch aan het project.

---

## 3. Next Steps — Deployment Automatisatie

### Fase A: GitHub Actions workflow (zonder auth)

**Doel**: Push naar main → automatisch deploy API + Frontend.

| Stap | Actie |
|------|-------|
| 1 | Repo secret `GCP_SA_KEY` (service account JSON met Cloud Run, Secret Manager, Cloud Build) |
| 2 | Workflow `.github/workflows/deploy.yml` |
| 3 | Job 1: deploy API (`--source ./api-backend`, `--set-secrets`, `--add-cloudsql-instances`) |
| 4 | Job 2: deploy Frontend (cloudbuild met `_API_URL` substitution) |
| 5 | API URL dynamisch: output van job 1 → input voor job 2 |

**Geen wijziging** bij auth — API heeft geen Firebase env vars nodig (ADC).

---

### Fase B: Frontend build met Firebase (na Sprint 7)

**Wat**: Frontend cloudbuild moet Firebase config meekrijgen bij build.

| Stap | Actie |
|------|-------|
| 1 | GitHub Secrets: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID` |
| 2 | Cloudbuild: `--build-arg NEXT_PUBLIC_FIREBASE_API_KEY=$_FIREBASE_API_KEY` (etc.) |
| 3 | Of: build-env-vars file; Cloud Build substitution vars |
| 4 | Dockerfile: ARG + ENV voor alle NEXT_PUBLIC_FIREBASE_* |

**Let op**: Firebase config is **niet geheim** (apiKey is publiek), maar we willen het niet in git. GitHub Secrets → Cloud Build substitutions.

---

### Fase C: AUTH_MODE en productie-check

| Stap | Actie |
|------|-------|
| 1 | API deploy: **geen** `AUTH_MODE` in productie (of expliciet weglaten) |
| 2 | Implementatie blokkeert mock in prod (zie [IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md](../security/design/IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md)) |
| 3 | CI: optioneel check dat `AUTH_MODE` niet in Cloud Run env vars staat voor prod |

---

## 4. Voorgestelde workflow (concept)

```yaml
# .github/workflows/deploy.yml
name: Deploy to GCP

on:
  push:
    branches: [main]

env:
  REGION: europe-west1
  PROJECT_ID: subscription-tracker-21713  # of ${{ vars.GCP_PROJECT_ID }}

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    outputs:
      api_url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/setup-gcloud@v2
      - id: deploy
        run: |
          gcloud run deploy subscription-tracker-api \
            --source ./api-backend \
            --region ${{ env.REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --add-cloudsql-instances ${{ env.PROJECT_ID }}:${{ env.REGION }}:subscription-tracker-db \
            --set-secrets DATABASE_URL=db-url:latest \
            --format="value(status.url)"
          # Output URL voor frontend build

  deploy-frontend:
    needs: deploy-api
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/setup-gcloud@v2
      - run: |
          cd subscription-tracker
          gcloud builds submit --config cloudbuild.yaml \
            --substitutions=_API_URL=${{ needs.deploy-api.outputs.api_url }}/v1,_FIREBASE_API_KEY=${{ secrets.FIREBASE_API_KEY }},_FIREBASE_AUTH_DOMAIN=${{ secrets.FIREBASE_AUTH_DOMAIN }},_FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }}
```

**Nog te doen**: cloudbuild.yaml uitbreiden met Firebase build args.

---

## 5. Checklist vóór automatisatie

| # | Item | Status |
|---|------|--------|
| 1 | Handmatige deploy werkt (API + Frontend) | ✅ |
| 2 | GCP service account met rechten | Te configureren |
| 3 | GitHub Secrets: GCP_SA_KEY | Te configureren |
| 4 | Firebase Auth live | Sprint 7 |
| 5 | GitHub Secrets: FIREBASE_* (voor frontend build) | Na Sprint 7 |
| 6 | cloudbuild.yaml: Firebase build args | Na Sprint 7 |

---

## 5.1 GCP Service Account — Least Privilege (PenPeter)

**Motivatie**: De service account waarvan de JSON-key in `GCP_SA_KEY` zit, heeft brede toegang tot je GCP-project. Bij lek (bijv. key in logs, repo, of gecompromitteerde runner) beperkt least privilege de schade: de aanvaller kan dan alleen deployen, niet bijv. databases droppen of andere projecten aanspreken. Geen Owner/Editor — alleen wat strikt nodig is.

**Aanbevolen rollen** voor de CI/CD service account:

| Rol | Doel |
|-----|------|
| `roles/run.admin` | Cloud Run services deployen |
| `roles/iam.serviceAccountUser` | Cloud Run mag de compute SA gebruiken |
| `roles/secretmanager.secretAccessor` | db-url lezen voor API deploy |
| `roles/cloudbuild.builds.builder` | Cloud Build triggers (frontend build) |
| `roles/storage.objectViewer` | Cloud Build leest source uit GCS (indien nodig) |

**Niet toekennen**: `roles/owner`, `roles/editor`, `roles/cloudsql.admin`, of bredere rechten dan bovenstaand.

**Aanmaken** (voorbeeld):

```bash
gcloud iam service-accounts create github-actions-deploy \
  --display-name="GitHub Actions Deploy"
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-actions-deploy@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"
# ... idem voor overige rollen
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions-deploy@PROJECT_ID.iam.gserviceaccount.com
# key.json → GitHub Secrets als GCP_SA_KEY
```

---

## 6. Referenties

- [DEPLOYMENT_GCP.md](./DEPLOYMENT_GCP.md) — CI/CD voorstel
- [FIREBASE_SECURE_SETUP.md](../security/FIREBASE_SECURE_SETUP.md) — Firebase config
- [subscription-tracker/cloudbuild.yaml](../../subscription-tracker/cloudbuild.yaml) — Frontend build

---

*Ian — DevSecOps — Deployment Automatisatie Next Steps*
