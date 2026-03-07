# GCP Stappenplan — Voor de Lead PM

**Auteurs**: Alex (Architect) + Ian (DevSecOps)  
**Datum**: 2026-02-28  
**Doel**: Simpel stappenplan voor iemand met een Google Cloud-abonnement maar geen actieve ervaring

---

## Wat ga je bouwen?

```
[Gebruiker] → [Frontend (Cloud Run)] → [API (Cloud Run)] → [Database (Cloud SQL)]
                    ↑                           ↑
              Next.js app                 Express API
              (jouw UI)                   (jouw data)
```

Alles draait in **Google Cloud**, regio **europe-west1** (België, GDPR-vriendelijk).

---

## Overzicht: 6 fases

| Fase | Wat | Waarom |
|------|-----|--------|
| **0** | GCP project + gcloud CLI | Basis om te kunnen werken |
| **1** | Cloud SQL (database) | Waar je data leeft |
| **2** | Secret Manager | Wachtwoord database veilig opslaan |
| **3** | Migratie (schema) | Tabellen aanmaken in de database |
| **4** | API deployen | Backend live zetten |
| **5** | Frontend deployen | UI live zetten |

**Auth (login)** komt in **Fase 6** — later. Eerst draait de app zonder login; daarna voegen we Firebase toe.

---

## Fase 0: Voorbereiding (eenmalig)

### 0.1 GCP project

1. Ga naar [console.cloud.google.com](https://console.cloud.google.com)
2. Klik op het project-dropdown (bovenaan) → **Nieuw project**
3. Naam: bijv. `subscription-tracker`
4. Noteer het **Project ID** (bijv. `subscription-tracker-12345`) — dat heb je overal nodig

### 0.2 Billing inschakelen

- Zonder billing werkt Cloud Run/Cloud SQL niet
- Free tier: eerste €300 gratis, daarna pay-as-you-go
- Geschat voor deze app: **€0–25/maand** bij laag verkeer

### 0.3 gcloud CLI installeren

```bash
# macOS (Homebrew)
brew install --cask google-cloud-cli
```

Daarna inloggen:

```bash
gcloud auth login
gcloud config set project JOUW_PROJECT_ID
```

**Check**: `gcloud auth list` — je moet ingelogd zijn.

### 0.4 APIs inschakelen

Cloud Run, Cloud SQL, Secret Manager en Artifact Registry moeten actief zijn:

```bash
gcloud services enable run.googleapis.com sqladmin.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com
```

---

## Fase 1: Database (Cloud SQL)

**Wat**: Een PostgreSQL-database in de cloud. Hier komt je data (categories, subscriptions, users).

**Waar**: [Cloud SQL](https://console.cloud.google.com/sql) in de Console, of via onderstaand commando.

```bash
gcloud sql instances create subscription-tracker-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=europe-west1
```

**Duur**: ~5–10 minuten.  
**Kosten**: db-f1-micro ≈ €0–15/maand.

---

## Fase 2: Secret Manager

**Wat**: Veilige opslag voor het database-wachtwoord. Geen wachtwoord in code of git.

**Stappen**:

1. Database aanmaken in Cloud SQL:
   ```bash
   gcloud sql databases create subscription_tracker --instance=subscription-tracker-db
   ```

2. Wachtwoord genereren en instellen:
   ```bash
   # Genereer wachtwoord (bewaar dit!)
   openssl rand -base64 24

   gcloud sql users set-password postgres \
     --instance=subscription-tracker-db \
     --password=JOUW_GEGENEREERD_WACHTWOORD
   ```

3. Connection string in Secret Manager zetten:
   ```bash
   CONN="postgresql://postgres:JOUW_WACHTWOORD@/subscription_tracker?host=/cloudsql/JOUW_PROJECT_ID:europe-west1:subscription-tracker-db"
   echo -n "$CONN" | gcloud secrets create db-url --data-file=-
   ```

---

## Fase 3: Migratie (schema)

**Wat**: Tabellen aanmaken (categories, subscriptions, users).

**Hoe**: Cloud SQL Proxy (verbindt lokaal met Cloud SQL) + psql.

**Cloud SQL Proxy installeren** (eenmalig):
```bash
brew install cloud-sql-proxy
# Of: https://cloud.google.com/sql/docs/postgres/connect-auth-proxy#install
```

```bash
# 1. Proxy starten (laat draaien in aparte terminal)
cloud_sql_proxy -instances=JOUW_PROJECT_ID:europe-west1:subscription-tracker-db=tcp:5432

# 2. Migratie uitvoeren
export DATABASE_URL="postgresql://postgres:JOUW_WACHTWOORD@localhost:5432/subscription_tracker"
psql "$DATABASE_URL" -f migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f migrations/002_mock_user.sql
```

**Check**: `psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM categories;"` — verwacht: 11.

---

## Fase 4: API deployen

**Wat**: API (Express) op Cloud Run zetten. De API praat met de database via Secret Manager.

```bash
cd api-backend

gcloud run deploy subscription-tracker-api \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances JOUW_PROJECT_ID:europe-west1:subscription-tracker-db \
  --set-secrets DATABASE_URL=db-url:latest
```

**Output**: Een URL zoals `https://subscription-tracker-api-xxx.run.app`. **Noteer deze.**  
**Check**: `curl https://JOUW_API_URL/v1/categories` — verwacht: JSON met 11 categories.

---

## Fase 5: Frontend deployen

**Wat**: Next.js UI op Cloud Run. De frontend moet weten waar de API staat.

```bash
cd subscription-tracker

gcloud run deploy subscription-tracker-web \
  --source . \
  --region europe-west1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://JOUW_API_URL/v1
```

**Output**: Een URL zoals `https://subscription-tracker-web-xxx.run.app`. **Dat is je app.**

---

## Fase 6: Auth (later) — Firebase

**Wat gebeurt er straks?**

1. **Nu**: De app draait zonder login. Iedereen kan dezelfde data zien (of mock data).
2. **Straks**: Firebase Auth — "Sign in with Google" (of Facebook). Elke gebruiker ziet alleen eigen data.

**Flow in het kort**:

```
[Gebruiker] → Klikt "Sign in with Google"
       ↓
[Firebase] → Handelt Google OAuth af, geeft id_token
       ↓
[Frontend] → Stuurt token mee bij elke API-call
       ↓
[API] → Verifieert token (Firebase Admin SDK), leest user_id
       ↓
[Database] → Filtert data op user_id
```

**Wat moet je dan doen?**

- Firebase project koppelen aan je GCP project (zelfde project)
- Firebase Console → Authentication → Google inschakelen
- Env vars in frontend: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- Backend: Firebase Admin SDK voor token-verificatie

**Geen zorgen nu** — deze stappen komen later. De app werkt eerst zonder auth.

---

## Referenties (voor de details)

| Document | Voor | Inhoud |
|----------|------|--------|
| [GCP_SETUP_GUIDE.md](./GCP_SETUP_GUIDE.md) | Copy-paste commands | Alle gcloud-commando's, troubleshooting, Cloud SQL Proxy |
| [DEPLOYMENT_GCP.md](./DEPLOYMENT_GCP.md) | Technische details | Architectuur, CI/CD, security |
| [GCP_DEPLOYMENT_STEPS.md](./GCP_DEPLOYMENT_STEPS.md) | Volgorde | Checklist, rollback |
| [FIREBASE_SECURE_SETUP.md](./FIREBASE_SECURE_SETUP.md) | Auth (later) | Firebase configuratie, security |

---

## Checklist

- [ ] GCP project + billing
- [ ] gcloud CLI geïnstalleerd + `gcloud auth login`
- [ ] Cloud SQL instance
- [ ] Database + wachtwoord
- [ ] Secret Manager (db-url)
- [ ] Migratie 001 + 002 uitgevoerd
- [ ] API gedeployed
- [ ] Frontend gedeployed
- [ ] App werkt: frontend URL → categories laden

---

*Alex + Ian — GCP Stappenplan voor Lead PM*
