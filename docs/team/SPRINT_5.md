# Sprint 5 — GCP Integratie

**Co-PM Intelligence** — Aansturing  
**Status**: In uitvoering  
**Focus**: Google Cloud integratie — Cloud SQL, Cloud Run, Firebase Auth

---

## 🎯 Sprint Doel

Implementatie van de GCP-architectuur zoals gedocumenteerd. Naadloze overgang van mock naar productie.

---

## 📋 Taken & Verantwoordelijken

### P0 — Backend & Infra

| # | Taak | Status | Verantwoordelijke |
|---|------|--------|-------------------|
| 1 | Cloud SQL schema — migrations/001_initial_schema.sql | ✅ | @Floyd |
| 2 | API container (Express) — api-backend/ | ✅ | @Floyd |
| 3 | Dockerfile voor Cloud Run | ✅ | @Ian |

### P1 — Auth & Frontend

| # | Taak | Status | Verantwoordelijke |
|---|------|--------|-------------------|
| 4 | Firebase Auth setup — lib/firebase.ts, login pagina | ✅ | @Fede |
| 5 | Token verify in backend (Firebase Admin SDK) | Open | @Floyd |
| 6 | Frontend: API client i.p.v. Zustand (ApiDataProvider) | ✅ | @Fede |

---

## ✅ Uitgevoerd (Sprint 5 start)

- **migrations/001_initial_schema.sql** — Schema voor users, categories, subscriptions
- **api-backend/** — Express API (GET/POST/PUT/DELETE), Dockerfile, README
- **lib/firebase.ts** — Firebase Auth init, signInWithGoogle
- **app/login/page.tsx** — Login pagina met Google SSO
- **ApiDataProvider** — Frontend gebruikt API client i.p.v. Zustand
- **.env.example** — Template voor API_URL en Firebase config

**Recent (2026-02-28)**:
- GCP all the way beslissing — Optie A (Cloud Run voor frontend + API)
- GCP_DEPLOYMENT_STEPS.md — architectuurbeslissing, volgorde, pre-deploy checklist
- LEAD_PM_GCP_STAPPENPLAN.md — simpel stappenplan voor Lead PM (geen GCP-ervaring)
- Frontend Dockerfile + next.config standalone — klaar voor Cloud Run deploy

**Nog handmatig**: Cloud SQL instance aanmaken, schema runnen, Cloud Run deploy, Firebase project configureren.

---

## 📢 Directieven

**@Floyd** — Volg [MOCK_TO_GCP_MIGRATION.md](../architecture/MOCK_TO_GCP_MIGRATION.md) voor schema (users, user_id op subscriptions). API contract blijft identiek. Token verify via Firebase Admin SDK op Cloud Run.

**@Ian** — Cloud Run deploy met Secret Manager. Regio `europe-west1` voor GDPR.

**@Fede** — Firebase config in env vars. Login pagina met SSO buttons. Frontend schakelt over naar `lib/api-client.ts` met auth header.

---

## 📁 Referentie

- [GCP_ARCHITECTURE.md](../architecture/GCP_ARCHITECTURE.md)
- [FIREBASE_SECURE_SETUP.md](../security/FIREBASE_SECURE_SETUP.md)
- [MOCK_TO_GCP_MIGRATION.md](../architecture/MOCK_TO_GCP_MIGRATION.md)
- [API_CONTRACT.md](../architecture/API_CONTRACT.md)

---

*Co-PM Intelligence — Sprint 5 — GCP Integratie*
