# Google Cloud Architectuur — Subscription Tracker

**Auteur**: Architect Alex  
**Datum**: 2026-02-14  
**Context**: Beste oplossing gegeven bestaand Google Cloud abonnement

---

## 🎯 Vraag
Welke GCP-architectuur past het best bij de Subscription Tracker, gegeven dat er al een Google Cloud abonnement is?

---

## 📊 Opties Vergeleken

| Optie | Compute | Database | Kosten | Complexiteit | Aanbeveling |
|-------|---------|----------|--------|--------------|-------------|
| **A** | Cloud Run | Cloud SQL (PostgreSQL) | €€ | Medium | ⭐⭐⭐ **Aanbevolen** |
| **B** | Cloud Run | Firestore | € | Laag | ⭐⭐ Alternatief |
| **C** | Cloud Functions | Firestore | € | Laag | ⭐ Eenvoudig, minder flexibel |
| **D** | App Engine | Cloud SQL | €€€ | Hoog | ❌ Overkill |

---

## 🏆 Aanbeveling: **Optie A — Cloud Run + Cloud SQL**

### Waarom

1. **Cloud Run**
   - Serverless containers — betaal alleen voor gebruik
   - Schaal automatisch naar nul (geen kosten bij geen traffic)
   - Ondersteunt Node.js, Python, elke container
   - Eenvoudige deploy via Docker image
   - Past bij Next.js API routes of aparte Express/FastAPI service

2. **Cloud SQL (PostgreSQL)**
   - Relationeel model past perfect bij subscriptions + categories
   - Bestaand data model (API_CONTRACT) sluit direct aan
   - Beheerd, backups, replicatie inbegrepen
   - **Cloud SQL for PostgreSQL** — kleine instance (db-g1-small) is goedkoop

3. **Google Cloud abonnement**
   - Cloud Run free tier: 2 miljoen requests/maand
   - Cloud SQL: db-g1-small ≈ €15–25/maand
   - Geen lock-in; migratie naar andere cloud is mogelijk

---

## 🏗️ Voorgestelde Architectuur

```
┌─────────────────────────────────────────────────────────────┐
│                     Google Cloud                             │
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐  │
│  │  Cloud Run   │────▶│  Cloud SQL   │     │  Secret     │  │
│  │  (API)       │     │  PostgreSQL  │     │  Manager    │  │
│  └──────────────┘     └──────────────┘     └─────────────┘  │
│         ▲                                                      │
│         │                                                      │
│  ┌──────┴──────┐                                              │
│  │  Cloud Run  │  (of Vercel/Cloud Run voor Next.js)          │
│  │  Frontend   │                                              │
│  └─────────────┘                                              │
└─────────────────────────────────────────────────────────────┘
         ▲
         │ HTTPS
         │
    [ Gebruikers ]
```

### Componenten

| Component | Technologie | Rol |
|-----------|-------------|-----|
| **Frontend** | Next.js (Vercel of Cloud Run) | Subscription Tracker UI |
| **API** | Express/FastAPI in container | REST endpoints |
| **Database** | Cloud SQL PostgreSQL | Persistentie |
| **Secrets** | Secret Manager | DB credentials, JWT keys |
| **Auth** | Firebase Auth of Identity Platform | Login (Fase 2) — **Zie [SECURITY_ARCHITECTURE_REVIEW_SSO.md](../security/SECURITY_ARCHITECTURE_REVIEW_SSO.md) voor SSO (Google, Facebook)** |

---

## 🔄 Alternatief: **Optie B — Cloud Run + Firestore**

**Wanneer kiezen:**
- Wil je **geen** database beheren (geen migrations, geen connection pooling)
- Document-model is acceptabel (subscriptions als documents, categories als subcollection)
- Nog lagere kosten bij zeer lage traffic

**Trade-off:** Firestore is NoSQL. Het huidige relationele model (subscriptions → categoryId) moet worden gemapt naar document structure. Werkt prima, maar schema-wijzigingen zijn anders dan bij SQL.

---

## 📋 Implementatiestappen (Optie A)

**Handmatige setup**: Zie [GCP_SETUP_GUIDE.md](../setup/GCP_SETUP_GUIDE.md) — copy-paste guide voor self-setup.

1. **Cloud SQL** — Maak PostgreSQL instance (db-g1-small, ENTERPRISE edition)
2. **Schema** — Run migrations (subscriptions, categories tabellen)
3. **API container** — Dockerfile voor Express/FastAPI, connect naar Cloud SQL
4. **Cloud Run** — Deploy container, koppel Secret Manager voor DB URL
5. **Frontend** — Deploy Next.js naar Cloud Run of Vercel, wijzig API base URL naar Cloud Run URL
6. **Auth** — Firebase Auth of Identity Platform (Fase 2)

---

## 💰 Geschatte kosten (maandelijks, laag traffic)

| Service | Geschat |
|---------|---------|
| Cloud Run (API) | €0–5 (free tier) |
| Cloud SQL (micro) | €0–15 |
| Secret Manager | €0–1 |
| **Totaal** | **€0–25/maand** |

Bij hoger gebruik: schaal lineair. Cloud Run + Cloud SQL zijn cost-effective.

---

## 🤔 Vragen voor Lead PM

1. **Vercel vs Cloud Run voor frontend?** — Next.js kan op Vercel (eenvoudig) of op Cloud Run (alles in GCP).
2. **Firebase Auth of Identity Platform?** — Firebase Auth is eenvoudiger; Identity Platform is enterprise-grade.
3. **Regio?** — `europe-west1` (België) voor GDPR/data residency.

---

---

## 🔐 Security — PenPeter Review

**Database architectuur**: [SECURITY_REVIEW_GCP_DATABASE.md](../security/SECURITY_REVIEW_GCP_DATABASE.md)

PenPeter akkoord met Alex' aanbeveling. Aandacht: SSL config, dedicated DB user, CORS beperken.

---

## 🔐 SSO (Google, Facebook) — PenPeter Review

**Zie**: [SECURITY_ARCHITECTURE_REVIEW_SSO.md](../security/SECURITY_ARCHITECTURE_REVIEW_SSO.md)

**Aanbeveling PenPeter**: Firebase Auth voor eenvoudige SSO. Native GCP, minimale code, veilige token flow.

**Alex validatie**: [FIREBASE_SECURE_SETUP.md](../security/FIREBASE_SECURE_SETUP.md) — Security recommendations gevalideerd, secure setup guide.

**Floyd migratie**: [MOCK_TO_GCP_MIGRATION.md](./MOCK_TO_GCP_MIGRATION.md) — Hoe mock aansluit op GCP + SSO.

---

*Alex — Architect — GCP Aanbeveling*
