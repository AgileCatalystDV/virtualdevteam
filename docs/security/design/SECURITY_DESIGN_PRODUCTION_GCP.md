# Security Design — Productie GCP Setup

**Auteurs**: PenPeter (Security), Ian (DevSecOps), Alex (Architect)  
**Datum**: 2026-03-08  
**Scope**: Subscription Tracker — Cloud Run + Cloud SQL + Secret Manager  
**Context**: Architectuur bekend; design vóór Threat Model

---

## 1. Huidige Productie-architectuur (Alex)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Google Cloud (europe-west1)                       │
│                                                                          │
│  ┌─────────────────┐         ┌─────────────────┐    ┌───────────────┐  │
│  │ Cloud Run       │  HTTPS  │ Cloud Run       │    │ Secret        │  │
│  │ Frontend        │────────▶│ API             │    │ Manager       │  │
│  │ (Next.js)       │         │ (Express)       │    │ (db-url)      │  │
│  └─────────────────┘         └────────┬────────┘    └───────┬───────┘  │
│         ▲                             │                      │          │
│         │                             │ Unix socket          │ inject   │
│         │                             ▼                      │          │
│         │                    ┌─────────────────┐            │          │
│         │                    │ Cloud SQL        │◀───────────┘          │
│         │                    │ PostgreSQL      │                        │
│         │                    └─────────────────┘                        │
└─────────┼──────────────────────────────────────────────────────────────┘
          │
          │ HTTPS
          │
    [ Gebruikers ]
```

### Componenten

| Component | Service | Vertrouwenszone |
|-----------|---------|-----------------|
| Frontend | subscription-tracker-web | Publiek (allUsers invoker) |
| API | subscription-tracker-api | Publiek (allUsers invoker) |
| Database | subscription-tracker-db | Intern (alleen Cloud Run) |
| Secrets | db-url | Secret Manager (Cloud Run SA) |

---

## 2. Trust Boundaries (PenPeter)

| Boundary | Van | Naar | Wat kruist |
|----------|-----|------|------------|
| **Internet → Frontend** | Gebruiker | Cloud Run | HTTPS, cookies, tokens |
| **Frontend → API** | Cloud Run (FE) | Cloud Run (API) | REST, Bearer token |
| **API → Cloud SQL** | Cloud Run | Cloud SQL | SQL (Unix socket) |
| **API → Secret Manager** | Cloud Run | Secret Manager | DATABASE_URL ophalen |

**Assets**:
- User subscriptions (PII-achtig: namen, bedragen)
- Auth tokens (Firebase id_token)
- Database credentials (Secret Manager)

---

## 3. Security Design — Beslissingen

### 3.1 Netwerk & Transport (Ian + Alex)

| Beslissing | Huidige staat | Productie-doel |
|------------|---------------|---------------|
| **HTTPS** | ✅ Cloud Run default | Blijft |
| **Cloud SQL exposure** | Unix socket (geen public IP) | Blijft — verkeer intern |
| **SSL naar DB** | `rejectUnauthorized: true` bij public IP | db.js OK (zie SECURITY_REVIEW) |
| **VPC** | Cloud Run → Cloud SQL via /cloudsql | Geen VPC connector nodig |

### 3.2 Authenticatie & Autorisatie (PenPeter)

| Beslissing | Huidige staat | Productie-doel |
|------------|---------------|----------------|
| **Auth** | Mock / anoniem | Firebase Auth (Sprint 7) |
| **Token verify** | Niet geïmplementeerd | Firebase Admin SDK |
| **API IAM** | allUsers (publiek) | Blijft voor public app; IAP optioneel later |
| **DB user** | postgres | Dedicated user met least privilege (zie 3.4) |

### 3.3 Secrets & Credentials (Ian)

| Beslissing | Huidige staat | Productie-doel |
|------------|---------------|---------------|
| **DATABASE_URL** | Secret Manager | Blijft |
| **Cloud Run SA** | Default compute SA | Overweeg dedicated SA |
| **IAM op db-url** | Secret Accessor voor compute SA | Blijft; least privilege |
| **Rotatie** | Geen plan | Documenteer; plan periodieke rotatie |

### 3.4 Database (Alex + PenPeter)

| Beslissing | Huidige staat | Productie-doel |
|------------|---------------|---------------|
| **DB user** | postgres | `subscription_tracker_app` met beperkte rechten |
| **Rechten** | Superuser | SELECT, INSERT, UPDATE, DELETE op app-tabellen |
| **Migrations** | Handmatig (postgres) | Apart migratie-user of postgres voor schema |

### 3.5 API-beveiliging (PenPeter)

| Beslissing | Huidige staat | Productie-doel |
|------------|---------------|---------------|
| **CORS** | ✅ Beperkt (localhost + frontend URL) | Blijft |
| **Helmet** | ✅ Geïmplementeerd | Blijft |
| **Rate limiting** | Niet | express-rate-limit of Cloud Armor |
| **Body limit** | Default 100kb | Expliciet 50kb |
| **Input validatie** | Beperkt | Zod of handmatig; 400 bij invalid |

### 3.6 Kostenbeheersing (Ian)

| Beslissing | Huidige staat | Productie-doel |
|------------|---------------|---------------|
| **Max instances** | 1 (Bill Shock) | Blijft voor MVP; verhoog bij groei |
| **Cloud SQL stop** | Handmatig patch | Documenteer voor "garage" |

---

## 4. Open Punten (voor Threat Model)

1. **Firebase Auth**: Token flow, HttpOnly cookie vs sessionStorage
2. **Dedicated DB user**: Migratie-script, rollback
3. **Rate limiting**: Waar (API only?), drempelwaarden
4. **Monitoring**: Welke events loggen, alerting
5. **Incident response**: Wie, wanneer, runbook

---

## 5. Volgende stap

**Threat Model**: [THREAT_MODEL_PRODUCTION_GCP.md](./THREAT_MODEL_PRODUCTION_GCP.md) — STRIDE-analyse op basis van dit design.

---

## 6. Referenties

- [GCP_ARCHITECTURE.md](../../architecture/GCP_ARCHITECTURE.md)
- [SECURITY_REVIEW_GCP_DATABASE.md](../audits/SECURITY_REVIEW_GCP_DATABASE.md)
- [SECURITY_AUDIT_THEHAMMER_2026-02.md](../audits/SECURITY_AUDIT_THEHAMMER_2026-02.md)
- [DEPLOYMENT_GCP_MVP.md](../../setup/DEPLOYMENT_GCP_MVP.md)
- [FIREBASE_SECURE_SETUP.md](../FIREBASE_SECURE_SETUP.md)

---

*PenPeter, Ian, Alex — Security Design Productie GCP*
