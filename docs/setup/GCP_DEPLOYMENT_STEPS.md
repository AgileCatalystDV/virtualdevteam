# GCP All The Way — Architectuurbeslissing & Stappenplan

**Beslissing**: Optie A — Alles op Cloud Run (Lead PM, 2026-02-28)  
**Architect**: Alex | **DevSecOps**: Ian

---

## Beslissing

- **Frontend**: Cloud Run (Next.js standalone)
- **API**: Cloud Run (Express)
- **Database**: Cloud SQL PostgreSQL
- **Geen Vercel** — één platform, één factuur

---

## Volgorde (niet overslaan)

| # | Fase | Verantwoordelijke | Output |
|---|------|-------------------|--------|
| 1 | Infrastructuur | Ian | GCP project, APIs, Artifact Registry, Cloud SQL, Secret Manager |
| 2 | Database | Ian | Cloud SQL instance, database, migratie 001 uitgevoerd |
| 3 | API deploy | Ian | Cloud Run service `subscription-tracker-api` live |
| 4 | Frontend voorbereiding | Ian | Dockerfile + next.config standalone |
| 5 | Frontend deploy | Ian | Cloud Run service `subscription-tracker-web` live |
| 6 | CI/CD | Ian | GitHub Actions workflow op push main |

---

## Branch strategy

- **main** → productie
- Geen staging in v1

---

## Rollback

Cloud Run bewaart vorige revisies. Rollback:

```bash
gcloud run services update-traffic subscription-tracker-api --to-revisions=REVISION=100
```

---

## Pre-deploy checklist (Maya)

- [ ] `npm run build` slaagt (frontend)
- [ ] `npm run test` slaagt (frontend + API indien tests)
- [ ] Geen secrets in code
- [ ] Migratie 001 uitgevoerd op Cloud SQL
- [ ] Secret Manager `db-url` bestaat met correcte connection string

---

## Referenties

- [DEPLOYMENT_GCP.md](./DEPLOYMENT_GCP.md) — Volledige deployment strategie
- [DEV_SETUP.md](./DEV_SETUP.md) — Lokale dev + GCP deploy sectie

---

*Alex — Architect — GCP All The Way*
