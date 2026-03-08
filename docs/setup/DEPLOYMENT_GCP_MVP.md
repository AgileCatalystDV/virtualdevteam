# GCP MVP — Start/Stop & Beveiligen

**Auteur**: Ian (DevSecOps)  
**Datum**: 2026-03-08  
**Context**: Snelle referentie voor MVP-ops na succesvolle deploy. Firebase nog niet actief.

---

## URLs (na deploy)

| Service | URL |
|---------|-----|
| Frontend | https://subscription-tracker-web-761770841827.europe-west1.run.app |
| API | https://subscription-tracker-api-761770841827.europe-west1.run.app |
| API categories | https://subscription-tracker-api-761770841827.europe-west1.run.app/v1/categories |

---

## Beveiligen (blokkeer publieke toegang)

Voer uit om ongewenst verbruik te voorkomen. Niemand kan de app of API nog openen.

```bash
# Frontend
gcloud run services remove-iam-policy-binding subscription-tracker-web \
  --region=europe-west1 \
  --member="allUsers" \
  --role="roles/run.invoker"

# API
gcloud run services remove-iam-policy-binding subscription-tracker-api \
  --region=europe-west1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

**Effect**: Cloud Run schaalt naar 0 bij geen verkeer. Cloud SQL blijft draaien (~€15–25/maand).

---

## Publiek maken (opnieuw)

```bash
# Frontend
gcloud run services add-iam-policy-binding subscription-tracker-web \
  --region=europe-west1 \
  --member="allUsers" \
  --role="roles/run.invoker"

# API
gcloud run services add-iam-policy-binding subscription-tracker-api \
  --region=europe-west1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

---

## Start / Stop (kort)

| Actie | Commando |
|-------|----------|
| **Cloud Run stop** (blokkeer toegang) | Zie "Beveiligen" hierboven |
| **Cloud Run start** (maak publiek) | Zie "Publiek maken" hierboven |
| **Cloud SQL stop** (geen DB-kosten) | Zie "Cloud SQL — Stoppen / Starten" hieronder |
| **Cloud SQL start** | Zie "Cloud SQL — Stoppen / Starten" hieronder |

**Let op**: Cloud SQL blijft altijd draaien tenzij je de instance stopt. Dat is de grootste kostenpost (~€15–25/maand).

---

## Cloud SQL — Stoppen / Starten

Cloud SQL heeft vaste maandkosten. Stop de instance als je de app een tijd niet gebruikt.

**Stoppen** (geen kosten meer voor de database):
```bash
gcloud sql instances patch subscription-tracker-db \
  --activation-policy=NEVER
```

**Starten** (om weer te testen):
```bash
gcloud sql instances patch subscription-tracker-db \
  --activation-policy=ALWAYS
```

**Let op**: Na stoppen duurt het opstarten ~1–2 minuten. Cloud Run (API) kan niet verbinden zolang de database uit staat.

---

## Bill Shock — Max instances (kostenplafond)

Voorkom dat een bot of DDoS je Cloud Run laat opschalen naar 100 containers. Met max 1 instance blijven kosten voorspelbaar (geen load balancing nodig voor MVP).

**Beperken** (aanbevolen voor MVP):
```bash
# API
gcloud run services update subscription-tracker-api \
  --region=europe-west1 \
  --max-instances=1

# Frontend
gcloud run services update subscription-tracker-web \
  --region=europe-west1 \
  --max-instances=1
```

**Herstellen** (voor demo/test — meer headroom):
```bash
# API — terug naar default (100)
gcloud run services update subscription-tracker-api \
  --region=europe-west1 \
  --max-instances=100

# Frontend — terug naar default (100)
gcloud run services update subscription-tracker-web \
  --region=europe-west1 \
  --max-instances=100
```

| Situatie | max-instances |
|----------|---------------|
| MVP / garage staan | 1 |
| Demo of load test | 5–10 of 100 |

---

## psql — Check of data persistent is (Cloud SQL vs mock)

Data van de GCP-deployed app gaat naar **Cloud SQL** (persistent). De "mock" in mock login is alleen de auth-token, niet de opslag.

**1. Cloud SQL Proxy starten** (aparte terminal):
```bash
cloud-sql-proxy subscription-tracker-21713:europe-west1:subscription-tracker-db
```

**2. Verbinden en checken** (wachtwoord uit Secret Manager of je notities):
```bash
export DATABASE_URL="postgresql://postgres:JOUW_WACHTWOORD@localhost:5432/subscription_tracker"
psql "$DATABASE_URL" -c "
  SELECT 
    (SELECT COUNT(*) FROM subscriptions) AS subscriptions_count,
    (SELECT COUNT(*) FROM categories) AS categories_count,
    (SELECT COUNT(*) FROM users) AS users_count;
"
```

**3. Laatste subscriptions bekijken**:
```bash
psql "$DATABASE_URL" -c "
  SELECT id, name, price, user_id, created_at 
  FROM subscriptions 
  ORDER BY created_at DESC 
  LIMIT 10;
"
```

| Resultaat | Betekenis |
|-----------|-----------|
| `subscriptions_count > 0` | Data staat in Cloud SQL (persistent) |
| `categories_count = 11` | Migratie OK |
| `user_id IS NULL` | Anonieme subscriptions |
| `user_id = 11111111-...` | Mock user subscriptions |

**Mock vs persistent**: Als je via de GCP-URL (subscription-tracker-web-xxx.run.app) subscriptions toevoegt, gaan ze naar Cloud SQL. De in-memory mock wordt alleen gebruikt bij lokaal dev met `npm run dev` en de Next.js `/api/v1` routes.

**Fix (2026-02)**: De frontend moet met `cloudbuild.yaml` gedeployed worden (niet `--source` + `--set-env-vars`). `NEXT_PUBLIC_API_URL` moet bij build time ingesteld zijn, anders valt de frontend terug op de embedded mock API en gaat data niet naar Cloud SQL. Zie [LEAD_PM_GCP_STAPPENPLAN.md](./LEAD_PM_GCP_STAPPENPLAN.md) Fase 5.

---

## Referenties

- [LEAD_PM_GCP_STAPPENPLAN.md](./LEAD_PM_GCP_STAPPENPLAN.md) — Volledig stappenplan
- [GCP_SETUP_GUIDE.md](./GCP_SETUP_GUIDE.md) — Copy-paste commands
- [MOCK_LOGIN.md](../security/MOCK_LOGIN.md) — Mock vs Firebase

---

*Ian — DevSecOps — MVP Ops*
