# Co-PM Docs Review — GCP Setup

**Reviewer**: Co-PM Intelligence  
**Datum**: 2026-02-15  
**Scope**: Documentatie voor GCP database setup door Lead PM (handmatig)

---

## ✅ Wat goed staat

| Doc | Beoordeling |
|-----|-------------|
| **GCP_ARCHITECTURE.md** | Duidelijke aanbeveling (Optie A), componenten, kosten |
| **DEPLOYMENT_GCP.md** | Stap-voor-stap, gcloud commands, Fase 1–4 |
| **SECURITY_REVIEW_GCP_DATABASE.md** | PenPeter checklist, SSL fix, dedicated user |
| **MOCK_TO_GCP_MIGRATION.md** | Schema, API client, auth flow |
| **FIREBASE_SECURE_SETUP.md** | Firebase config, authorized domains |
| **migrations/001_initial_schema.sql** | Compleet schema (users, categories, subscriptions) |

**Conclusie**: De documentatie is consistent en dekt architectuur, deployment en security.

---

## ⚠️ Gaps voor self-setup

De Lead PM zet GCP **zelf** op. De huidige docs veronderstellen enige GCP-ervaring. Ontbreekt:

| Gap | Impact | Oplossing |
|-----|--------|-----------|
| **Geen pre-requisites** | Onduidelijk wat je nodig hebt (gcloud CLI, project, billing) | Ian: Pre-requisites sectie |
| **Cloud SQL Proxy** | DEPLOYMENT_GCP noemt `cloud_sql_proxy` maar niet hoe te installeren | Ian: Installatie-instructies |
| **Dedicated DB user** | PenPeter adviseert `subscription_tracker_app`; DEPLOYMENT gebruikt `postgres` | Ian: SQL + gcloud voor app user |
| **Placeholder vervangen** | `PROJECT_ID`, `user:pass`, `GEHEIM` — waar vul je in? | Ian: Checklist met concrete stappen |
| **Volgorde + validatie** | Welke stap eerst? Hoe check je of het werkt? | Ian: Volgorde + smoke tests |
| **db-f1-micro beschikbaarheid** | Niet alle regio's hebben db-f1-micro | Ian: Alternatief (db-g1-small) |

---

## 📋 Aanbeveling: Ian — GCP Setup Guide

**Voorstel**: Ian maakt **GCP_SETUP_GUIDE.md** — een end-to-end guide voor handmatige setup door iemand zonder diep GCP-ervaring.

### Inhoud (suggestie)

1. **Pre-requisites**
   - Google Cloud account, billing ingeschakeld
   - `gcloud` CLI geïnstalleerd (`brew install google-cloud-sdk` of [installer](https://cloud.google.com/sdk/docs/install))
   - Cloud SQL Proxy (voor migratie): `brew install cloud-sql-proxy` of download

2. **Stap 0: Project kiezen**
   - `gcloud config set project PROJECT_ID`
   - APIs inschakelen (copy-paste blok)

3. **Stap 1: Cloud SQL**
   - Instance aanmaken (incl. `--no-assign-ip` indien alleen private)
   - Database + **app user** (niet postgres) — SQL script van PenPeter
   - Wachtwoord genereren: `openssl rand -base64 24`

4. **Stap 2: Secret Manager**
   - Secret aanmaken met connection string
   - Format: `postgresql://APP_USER:PASSWORD@/subscription_tracker?host=/cloudsql/PROJECT:REGION:INSTANCE`

5. **Stap 3: Migratie**
   - Cloud SQL Proxy starten
   - `psql` of `npm run migrate` (als Ian script toevoegt)
   - Validatie: `SELECT COUNT(*) FROM categories;` → 11 rijen

6. **Stap 4: API deployen**
   - `gcloud run deploy` met juiste flags
   - Validatie: `curl https://API_URL/v1/categories`

7. **Stap 5: Frontend**
   - Vercel of Cloud Run
   - `NEXT_PUBLIC_API_URL` instellen

8. **Troubleshooting**
   - "Connection refused" → Cloud SQL instance running? `--add-cloudsql-instances` correct?
   - "Permission denied" op secret → IAM voor Cloud Run SA
   - "db-f1-micro not available" → gebruik `db-g1-small`

---

## 📊 Doc-overzicht (na Ian-update)

| Doc | Doel | Doelgroep |
|-----|------|-----------|
| **GCP_ARCHITECTURE.md** | Waarom deze architectuur | Lead PM, team |
| **GCP_SETUP_GUIDE.md** | Hoe opzetten (nieuw) | Lead PM (self-setup) |
| **DEPLOYMENT_GCP.md** | Technische deploy details | Ian, Floyd |
| **SECURITY_REVIEW_GCP_DATABASE.md** | Security checklist | PenPeter, Ian |

---

## ✅ Conclusie Co-PM

De docs zijn **goed en consistent**. Voor self-setup door de Lead PM ontbreekt een **praktische, copy-paste vriendelijke guide** met pre-requisites, volgorde en validatiestappen. **@Ian** wordt gevraagd om **GCP_SETUP_GUIDE.md** toe te voegen.

**Update**: Ian heeft [GCP_SETUP_GUIDE.md](./GCP_SETUP_GUIDE.md) toegevoegd — copy-paste guide met pre-requisites, volgorde, troubleshooting.

---

*Co-PM Intelligence — Docs Review GCP*
