# Co-PM Skills Review

**Reviewer**: Co-PM Intelligence  
**Datum**: 2026-02-28  
**Scope**: Skills van teamleden nagekeken, proactief verbeterd en uitgebreid

---

## Samenvatting

| Actie | Status |
|-------|--------|
| Bestaande skills bijgewerkt | 6 skills |
| Nieuwe skills toegevoegd | 2 skills |
| TEAM_PROTOCOL skills lijst | Bijgewerkt |

---

## Bijgewerkte skills

### deployment-pipeline (Ian)
- **Was**: Generiek (K8s, GitHub Actions, Trivy)
- **Nu**: GCP-specifiek — Cloud Run, gcloud deploy, volgorde API → Frontend, referenties naar GCP docs

### gcp-patterns
- **Toegevoegd**: Frontend deploy (Next.js standalone), Artifact Registry
- **Toegevoegd**: LEAD_PM_GCP_STAPPENPLAN als eerste referentie

### dev-setup
- **Toegevoegd**: AUTH_MODE, NEXT_PUBLIC_AUTH_MODE voor mock login
- **Toegevoegd**: Sectie "Mock auth (lokaal)" met link naar MOCK_LOGIN.md

### code-review (Maya)
- **Toegevoegd**: Sectie E — Project-specifiek (Next.js, Express, CORS, auth)

### nextjs-frontend (Fede)
- **Toegevoegd**: Cloud Run standalone output — next.config, Dockerfile pattern

### security-audit (PenPeter)
- **Toegevoegd**: GCP-specifiek — Secret Manager, Cloud Run IAM, CORS, Firebase Auth

---

## Nieuwe skills

### firebase-auth
- **Doel**: Firebase Auth + Admin SDK bij login/token verify (Fase 6)
- **Eigenaar**: Floyd (backend), Fede (frontend)
- **Inhoud**: Architectuur, backend verify, frontend config, mock vs productie

### backend-express (Floyd)
- **Doel**: Express 5 + Cloud SQL patterns
- **Inhoud**: db.js, parameterized queries, migraties, auth middleware

---

## Skills overzicht (na review)

| Skill | Eigenaar | Wanneer |
|-------|----------|---------|
| architecture-review | Alex + team | Architectuur beslissingen |
| backend-express | Floyd | API, DB, migraties |
| code-review | Maya | Code review |
| deployment-pipeline | Ian | CI/CD, GCP deploy |
| dev-setup | Ian | Lokale dev |
| firebase-auth | Floyd, Fede | Auth (Fase 6) |
| frontend-testing | Maya | Vitest, RTL |
| gcp-patterns | Ian, Alex | GCP infra |
| nextjs-frontend | Fede | Next.js app |
| security-audit | PenPeter | Security audit |
| threat-modeling | PenPeter | STRIDE |
| when-to-ask | Alle | Autonomie vs checkpoint |

---

## Niet toegevoegd (bewust)

- **integration-testing**: TEAM_SKILLS_IMPROVEMENT_PROPOSAL noemde dit — voor later; project heeft nog geen integration test setup
- **api-contract-testing**: Idem — Pact/handmatige contract checks; kan bij API stabilisatie

---

*Co-PM Intelligence — Skills Review*
