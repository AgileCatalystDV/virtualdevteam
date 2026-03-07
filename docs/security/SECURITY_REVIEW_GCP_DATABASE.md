# Security Review — GCP Database Architectuur

**Reviewer**: PenPeter (Security Specialist)  
**Datum**: 2026-02-15  
**Scope**: GCP_ARCHITECTURE.md — Cloud Run + Cloud SQL + Secret Manager

---

## ✅ Akkoord met Alex' aanbeveling

**Optie A (Cloud Run + Cloud SQL)** is een solide keuze vanuit security-perspectief:

| Aspect | Beoordeling |
|--------|-------------|
| **Secret Manager** | ✅ Credentials niet in code; injectie via Cloud Run |
| **HTTPS** | ✅ Cloud Run default; encryptie in transit |
| **Serverless** | ✅ Geen langlopende VM's; kleiner attack surface |
| **Regio europe-west1** | ✅ GDPR/data residency |
| **Bewezen patroon** | ✅ GCP best practice |

---

## ⚠️ Aandachtspunten & Aanbevelingen

### 1. Cloud SQL — Netwerk & SSL

**Huidige setup**: Unix socket (`host=/cloudsql/PROJECT:REGION:INSTANCE`) — verkeer blijft binnen GCP.

| Maatregel | Status | Actie |
|-----------|--------|-------|
| **Geen public IP** | Aanbevolen | Cloud SQL instance zonder public IP; alleen private IP of Cloud SQL Auth Proxy |
| **SSL** | ⚠️ Check | Bij Unix socket: SSL vaak niet nodig (intern netwerk). Bij public IP: **altijd** SSL met `rejectUnauthorized: true` |

**Code review** (`api-backend/src/db.js`):

```javascript
ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
```

**Probleem**: `rejectUnauthorized: false` schakelt certificaatverificatie uit — MITM-risico.

**Aanbeveling**:
- Unix socket (Cloud Run → Cloud SQL): `ssl: false` — verkeer is intern
- Public IP (indien nodig): `ssl: { rejectUnauthorized: true }`

```javascript
// Aanbevolen
ssl: process.env.DATABASE_URL?.includes('/cloudsql/')
  ? false
  : process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: true }
    : false
```

---

### 2. Secret Manager — Veilig opzetten

| Stap | Actie |
|------|-------|
| 1 | Secret `db-url` aanmaken met connection string |
| 2 | **Geen** wachtwoord in git, logs of CI output |
| 3 | Cloud Run service account: alleen `roles/secretmanager.secretAccessor` voor `db-url` |
| 4 | Rotatie: plan periodieke wachtwoordrotatie; update secret |

**Connection string format** (geen credentials in URL indien mogelijk):
- Cloud SQL: gebruik **Cloud SQL IAM authentication** (optioneel, complexer) of sterk wachtwoord
- Wachtwoord: min. 16 chars, random, in Secret Manager

---

### 3. Cloud SQL — Database-hardening

| Maatregel | Beschrijving |
|-----------|---------------|
| **Dedicated user** | Geen `postgres` superuser voor app; maak `subscription_tracker_app` met beperkte rechten |
| **Least privilege** | Alleen `SELECT`, `INSERT`, `UPDATE`, `DELETE` op benodigde tabellen; geen `CREATE`, `DROP` |
| **SSL/TLS** | Cloud SQL enforceert SSL; bij private-only: controleer instance config |

```sql
-- Voorbeeld: app user met beperkte rechten
CREATE USER subscription_tracker_app WITH PASSWORD '...';
GRANT CONNECT ON DATABASE subscription_tracker TO subscription_tracker_app;
GRANT USAGE ON SCHEMA public TO subscription_tracker_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO subscription_tracker_app;
-- Geen GRANT op migrations-tabellen indien niet nodig
```

---

### 4. Cloud Run — IAM & Netwerk

| Maatregel | Actie |
|-----------|-------|
| **Service account** | Dedicated SA voor Cloud Run; geen default compute SA |
| **IAM** | `roles/run.invoker` voor aanroepers; `roles/cloudsql.client` voor DB-connectie |
| **VPC** | Cloud Run → Cloud SQL via VPC connector indien private IP; of Cloud SQL Auth Proxy (Unix socket) |
| **Ingress** | `--allow-unauthenticated` alleen voor public API; overweeg IAP voor admin |

---

### 5. CORS & API-beveiliging

| Item | Huidige staat | Aanbeveling |
|------|---------------|-------------|
| **CORS** | Open (`cors()`) | Beperk tot frontend-origin(s): `origin: ['https://jouwapp.run.app', 'https://jouwapp.vercel.app']` |
| **Rate limiting** | Niet geïmplementeerd | Overweeg Cloud Armor of middleware voor abuse-preventie |
| **Auth** | Fase 2 | Zodra Firebase Auth live: alle endpoints behalve health check achter auth |

---

## 🔒 Veilige setup — Stappenplan

### Fase 1: Infrastructuur (security-first)

1. **Cloud SQL**
   - Instance: `europe-west1`, `db-f1-micro` of `db-g1-small`
   - **Geen public IP** (alleen private) of public IP + alleen authorized networks
   - Sterk wachtwoord voor app user (niet postgres)

2. **Secret Manager**
   - `db-url` secret met connection string
   - IAM: alleen Cloud Run SA mag lezen

3. **Cloud Run**
   - Dedicated service account
   - `--set-secrets DATABASE_URL=db-url:latest`
   - `--add-cloudsql-instances` voor Unix socket

### Fase 2: Code

1. **db.js**: Fix SSL config (zie boven)
2. **CORS**: Beperk tot productie-origins
3. **Health check**: `/` of `/health` zonder auth — rest achter auth (Fase 2)

### Fase 3: Operatie

1. **Monitoring**: Cloud Logging voor failed connections, errors
2. **Backups**: Cloud SQL automated backups (default aan)
3. **Rotatie**: Plan voor wachtwoord/secret rotatie

---

## 📋 Security Checklist (PenPeter)

| # | Item | Status |
|---|------|--------|
| 1 | Secret Manager voor DATABASE_URL | Te configureren |
| 2 | Geen `rejectUnauthorized: false` in productie | ⚠️ Fix in db.js |
| 3 | Dedicated DB user (niet postgres) | Te configureren |
| 4 | Least privilege IAM op Cloud Run SA | Te configureren |
| 5 | CORS beperkt tot frontend | Te configureren |
| 6 | Regio europe-west1 | ✅ In architectuur |
| 7 | Geen secrets in code/logs | ✅ |
| 8 | Cloud SQL: private of authorized networks | Te configureren |

---

## ✅ Conclusie

**PenPeter is akkoord met Alex' architectuur.** Cloud Run + Cloud SQL + Secret Manager is een veilige, schaalbare keuze. De belangrijkste acties:

1. **Fix** `rejectUnauthorized: false` in `db.js`
2. **Configureer** dedicated DB user met least privilege
3. **Beperk** CORS in productie
4. **Documenteer** IAM- en secret-rotatiebeleid

Met deze maatregelen is de setup production-ready vanuit security-perspectief.

---

*PenPeter — Security Specialist — GCP Database Architecture Review*
