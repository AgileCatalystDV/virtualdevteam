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

**Let op**: De cask `google-cloud-cli` bestaat niet in Homebrew. Gebruik `google-cloud-sdk` (levert dezelfde gcloud CLI).

```bash
# macOS (Homebrew)
brew install --cask google-cloud-sdk
```

**Na de installatie** — PATH instellen (anders vindt de terminal `gcloud` niet):

```bash
# In de huidige sessie (direct testen):
export PATH="/usr/local/share/google-cloud-sdk/bin:$PATH"
gcloud --version   # Check of het werkt
```

**Permanent** (optioneel): voeg toe aan `~/.bashrc` of `~/.zshrc`:
```bash
export PATH="/usr/local/share/google-cloud-sdk/bin:$PATH"
```
*(Nieuwe terminal openen of `source ~/.bashrc` / `source ~/.zshrc`)*

Daarna inloggen:

```bash
gcloud auth login
gcloud config set project JOUW_PROJECT_ID - subscription-tracker-21713
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
  --edition=ENTERPRISE \
  --tier=db-g1-small \
  --region=europe-west1
```

**Let op**: `db-f1-micro` is niet meer beschikbaar in alle regio's. Gebruik `db-g1-small` (1 vCPU, 1.7 GB RAM). `--edition=ENTERPRISE` is vereist voor shared-core tiers.

**Duur**: ~5–10 minuten.  
**Kosten**: db-g1-small ≈ €15–25/maand.

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
   CONN="postgresql://postgres:JOUW_WACHTWOORD@/subscription_tracker?host=/cloudsql/subscription-tracker-21713:europe-west1:subscription-tracker-db"
   echo -n "$CONN" | gcloud secrets create db-url --data-file=-
   ```

---

## Fase 3: Migratie (schema)

**Wat**: Tabellen aanmaken (categories, subscriptions, users).

**Hoe**: Cloud SQL Proxy (verbindt lokaal met Cloud SQL) + psql.

**psql installeren** (als `psql: command not found`):
```bash
brew install libpq
# PATH toevoegen — kies het pad dat bij jouw Mac hoort:
# Intel Mac (Homebrew in /usr/local):
export PATH="/usr/local/opt/libpq/bin:$PATH"
# Apple Silicon (Homebrew in /opt/homebrew):
export PATH="/opt/homebrew/opt/libpq/bin:$PATH"
# Permanent: voeg de juiste regel toe aan ~/.bashrc of ~/.zshrc
# Na brew install: check de Caveats voor het exacte pad
```

**Cloud SQL Proxy installeren** (eenmalig):
```bash
brew install cloud-sql-proxy
# Of: https://cloud.google.com/sql/docs/postgres/connect-auth-proxy#install
```

**Application Default Credentials** (eenmalig, vóór eerste proxy-gebruik):
De proxy gebruikt ADC, niet `gcloud auth login`. Voer uit:
```bash
gcloud auth application-default login
```
Browser opent → inloggen. Daarna kan de proxy verbinden.

**Migratie uitvoeren**:
```bash
# 1. Proxy starten (laat draaien in aparte terminal)
# Vervang JOUW_PROJECT_ID door je project ID (bijv. subscription-tracker-21713)
cloud-sql-proxy JOUW_PROJECT_ID:europe-west1:subscription-tracker-db

# 2. In een andere terminal: migratie uitvoeren
export DATABASE_URL="postgresql://postgres:JOUW_WACHTWOORD@localhost:5432/subscription_tracker"
psql "$DATABASE_URL" -f migrations/001_initial_schema.sql
psql "$DATABASE_URL" -f migrations/002_mock_user.sql
```

**Let op**: Het commando is `cloud-sql-proxy` (streepje). De oude `cloud_sql_proxy` (underscore) is deprecated.

**Check**: `psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM categories;"` — verwacht: 11.

---

## Fase 4: API deployen

**Wat**: API (Express) op Cloud Run zetten. De API praat met de database via Secret Manager.

**IAM (eenmalig)** — Als deploy faalt met permission errors, voer uit (vervang PROJECT_ID en PROJECT_NUMBER):
```bash
# Project number ophalen:
gcloud projects describe JOUW_PROJECT_ID --format="value(projectNumber)"

# 1. Build kan source niet lezen uit Storage:
gcloud projects add-iam-policy-binding JOUW_PROJECT_ID \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# 2. Cloud Run kan secret db-url niet lezen:
gcloud secrets add-iam-policy-binding db-url \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

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

**Belangrijk**: `NEXT_PUBLIC_API_URL` moet bij **build time** ingesteld zijn (Next.js bakt het in). `--set-env-vars` (runtime) werkt niet. Gebruik `cloudbuild.yaml` met build-arg:

```bash
cd subscription-tracker

# Vervang JOUW_API_URL door de URL uit Fase 4 (bijv. https://subscription-tracker-api-761770841827.europe-west1.run.app)
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_API_URL=https://subscription-tracker-api-761770841827.europe-west1.run.app/v1
```

**Output**: Build + deploy. Frontend URL: `https://subscription-tracker-web-xxx.run.app`. **Dat is je app.**

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
| [FIREBASE_SECURE_SETUP.md](../security/FIREBASE_SECURE_SETUP.md) | Auth (later) | Firebase configuratie, security |

---

## Checklist

- [X] GCP project + billing
- [X] gcloud CLI geïnstalleerd + `gcloud auth login`
- [X] Cloud SQL instance
- [X] Database + wachtwoord
- [X] Secret Manager (db-url)
- [X] Migratie 001 + 002 uitgevoerd
- [ ] API gedeployed
- [ ] Frontend gedeployed
- [ ] App werkt: frontend URL → categories laden

---

*Alex + Ian — GCP Stappenplan voor Lead PM*
