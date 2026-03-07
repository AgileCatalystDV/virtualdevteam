# Co-PM Docs Alignment Review

**Reviewer**: Co-PM Intelligence  
**Datum**: 2026-02-28  
**Scope**: Structuur, optimalisaties, beslissingen — alles in lijn?

---

## Executive summary

De documentatie is **grotendeels consistent** na de recente GCP all the way beslissing. Er zijn enkele **inconsistenties** die aangepast moeten worden, en een **docs-index** ontbreekt. Geen blokkerende issues.

---

## Beslissingen — gedocumenteerd?

| Beslissing | Waar vastgelegd | Status |
|------------|-----------------|--------|
| **GCP all the way** (geen Vercel) | GCP_DEPLOYMENT_STEPS.md, LEAD_PM_GCP_STAPPENPLAN.md | OK |
| **Branch strategy** (main → prod, geen staging) | GCP_DEPLOYMENT_STEPS.md | OK |
| **Firebase Auth** (later, Fase 6) | LEAD_PM_GCP_STAPPENPLAN.md, FIREBASE_SECURE_SETUP.md | OK |
| **Optie A vs B** | DEPLOYMENT_GCP.md, GCP_ARCHITECTURE.md | Beide opties nog vermeld — **aanbeveling**: voeg "Beslissing: Optie A" toe aan DEPLOYMENT_GCP |

**Gap**: Geen centraal **Architecture Decision Record (ADR)** of beslissingenlog. Voor nu voldoende — beslissingen staan in GCP_DEPLOYMENT_STEPS. Bij groei: overweeg `docs/decisions/` met ADR-templates.

---

## Inconsistenties — te fixen

### 1. GCP_SETUP_GUIDE.md — Stap 5: Frontend

**Probleem**: "Vercel (aanbevolen voor Next.js)" — in strijd met GCP all the way beslissing.

**Aanbeveling**: Cloud Run als primaire optie, Vercel als alternatief (of verwijderen).

---

### 2. GCP_SETUP_GUIDE.md — CORS troubleshooting

**Probleem**: `cors({ origin: ['https://jouw-frontend.vercel.app'] })` — moet Cloud Run URL zijn.

**Aanbeveling**: `https://subscription-tracker-web-xxx.run.app` of generiek "jouw frontend Cloud Run URL".

---

### 3. DEPLOYMENT_GCP.md — "Wat ontbreekt"

**Probleem**: "Frontend Dockerfile | Ontbreekt" — **niet meer actueel**. Dockerfile bestaat (subscription-tracker/Dockerfile).

**Aanbeveling**: Status bijwerken naar ✅ of sectie herformuleren.

---

### 4. DEPLOYMENT_GCP.md — Optie B nog prominent

**Probleem**: Optie B (Vercel) staat nog als gelijkwaardige keuze. Beslissing is Optie A.

**Aanbeveling**: Voeg bovenaan toe: "**Beslissing (2026-02-28)**: Optie A — GCP all the way. Zie [GCP_DEPLOYMENT_STEPS.md](./GCP_DEPLOYMENT_STEPS.md)."

---

### 5. SPRINT_5.md — Niet bijgewerkt

**Probleem**: Sprint 5 vermeldt niet de recente deliverables: GCP_DEPLOYMENT_STEPS, LEAD_PM_GCP_STAPPENPLAN, frontend Dockerfile, next.config standalone.

**Aanbeveling**: Sprint 5 bijwerken met voltooide items.

---

## Structuur — docs/ overzicht

**Huidige situatie**: 30+ docs, geen index of duidelijke entry point.

| Categorie | Docs | Entry point |
|-----------|------|-------------|
| **Lead PM / setup** | LEAD_PM_GCP_STAPPENPLAN, DEV_SETUP, GCP_SETUP_GUIDE | LEAD_PM_GCP_STAPPENPLAN |
| **GCP deploy** | GCP_DEPLOYMENT_STEPS, DEPLOYMENT_GCP | GCP_DEPLOYMENT_STEPS |
| **Architectuur** | GCP_ARCHITECTURE, ARCHITECTURE | GCP_ARCHITECTURE |
| **Auth** | FIREBASE_SECURE_SETUP, MOCK_LOGIN, SECURITY_IMPLEMENTATION_PLAN | — |
| **Security** | SECURITY_*, FIREBASE_SECURE_SETUP | — |
| **Sprints** | SPRINT_1 t/m 5 | TEAM_PROTOCOL |
| **Specs** | SUBSCRIPTION_TRACKER_SPECS, API_CONTRACT | SUBSCRIPTION_TRACKER_SPECS |

**Aanbeveling**: Voeg `docs/README.md` toe met korte index en "Start hier" per persona (Lead PM, Developer, DevOps).

---

## Optimalisaties — geen actie vereist

| Item | Status |
|------|--------|
| **Redundantie** | LEAD_PM_GCP_STAPPENPLAN vs GCP_SETUP_GUIDE — verschillende doelgroepen (beginners vs copy-paste). Beide behouden. |
| **DEV_SETUP referenties** | Correct — LEAD_PM eerst, dan GCP_DEPLOYMENT_STEPS, DEPLOYMENT_GCP. |
| **TEAM_PROTOCOL Sprints** | Sprint 4 ✅, Sprint 5 "Gepland" — kan naar "In uitvoering" als Lead PM wil. |

---

## Actie-items (prioriteit)

| # | Actie | Status |
|---|-------|--------|
| 1 | GCP_SETUP_GUIDE Stap 5: Cloud Run primair, Vercel secundair | ✅ Uitgevoerd |
| 2 | GCP_SETUP_GUIDE CORS: Cloud Run URL | ✅ Uitgevoerd |
| 3 | DEPLOYMENT_GCP "Wat ontbreekt": Frontend Dockerfile ✅ | ✅ Uitgevoerd |
| 4 | DEPLOYMENT_GCP: Beslissing Optie A bovenaan | ✅ Uitgevoerd |
| 5 | SPRINT_5: Recente deliverables toevoegen | ✅ Uitgevoerd |
| 6 | docs/README.md — docs index | ✅ Uitgevoerd |

---

## Conclusie

De documentatie is **in lijn** met de GCP all the way beslissing. Alle actie-items zijn uitgevoerd.

---

*Co-PM Intelligence — Docs Alignment Review*
