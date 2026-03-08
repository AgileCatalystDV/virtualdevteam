# Sprint 4 — Mock Backend & GCP Architectuur

**Co-PM Intelligence** — Aansturing  
**Status**: ✅ Afgerond  
**Focus**: Mock backend, architectuurkeuze Google Cloud

---

## 🎯 Sprint Doel
1. **Mock backend** — API endpoints met mock data (geen echte DB)
2. **GCP architectuur** — @Alex adviseert beste oplossing gegeven Google Cloud abonnement
3. **Frontend koppeling** — Optioneel: frontend kan API aanroepen (of blijft Zustand tot productie)

---

## 📋 Taken & Verantwoordelijken

### ✅ P0 — Afgerond
| # | Taak | Status |
|---|------|--------|
| 1 | Mock API (subscriptions, categories) | ✅ `app/api/v1/` — GET/POST/PUT/DELETE |
| 2 | GCP architectuur aanbeveling | ✅ [GCP_ARCHITECTURE.md](../architecture/GCP_ARCHITECTURE.md) |

### P1 — Aanbevolen
| # | Taak | Verantwoordelijke |
|---|------|-------------------|
| 3 | Frontend: fetch van API i.p.v. Zustand (optioneel) | @Fede |
| 4 | Dockerfile voor backend (deploy-voorbereiding) | @Ian |

---

## 📢 Directieven

**@Floyd** — Bouw mock API volgens [API_CONTRACT.md](../architecture/API_CONTRACT.md). Gebruik Next.js API routes in `subscription-tracker/app/api/` of aparte Express server. Alle endpoints retourneren mock data (zelfde structuur als huidige store).

**@Alex** — Gezien **Google Cloud abonnement**: adviseer beste architectuur voor Subscription Tracker. Overweeg o.a. Cloud Run, Cloud SQL, Firestore, Cloud Functions. Output: `docs/architecture/GCP_ARCHITECTURE.md`.

**@Fede** — Na mock API: optioneel frontend aanpassen om van API te fetchen. Kan wachten tot echte backend.

---

## 📁 Referentie
- [API_CONTRACT.md](../architecture/API_CONTRACT.md)
- [SUBSCRIPTION_TRACKER_SPECS.md](../architecture/SUBSCRIPTION_TRACKER_SPECS.md)

---

*Co-PM Intelligence — Sprint 4*
