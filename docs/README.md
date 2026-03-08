# Documentatie — Subscription Tracker

Overzicht van de documentatie, georganiseerd per categorie.

---

## Start hier (per rol)

| Rol | Document | Inhoud |
|-----|----------|--------|
| **Lead PM** | [setup/LEAD_PM_GCP_STAPPENPLAN.md](./setup/LEAD_PM_GCP_STAPPENPLAN.md) | Simpel GCP-stappenplan, geen ervaring vereist |
| **Developer** | [setup/DEV_SETUP.md](./setup/DEV_SETUP.md) | Lokale dev (Docker of localhost Postgres) |
| **DevOps** | [setup/GCP_DEPLOYMENT_STEPS.md](./setup/GCP_DEPLOYMENT_STEPS.md) | GCP all the way — volgorde, checklist |

---

## Structuur

```
docs/
├── README.md           ← Je bent hier
├── setup/              ← Dev + GCP setup
├── architecture/       ← Architectuur + specs
├── security/           ← Security + auth
│   ├── design/         ← Design, threat model, implementatie
│   └── audits/         ← Reviews, audits
├── team/               ← Team, protocol, sprints
└── reviews/            ← Co-PM, QA, code reviews
```

---

## Categorieën

### setup/ — Dev & GCP
- [LEAD_PM_GCP_STAPPENPLAN.md](./setup/LEAD_PM_GCP_STAPPENPLAN.md) — GCP voor beginners
- [DEV_SETUP.md](./setup/DEV_SETUP.md) — Lokale ontwikkeling
- [GCP_SETUP_GUIDE.md](./setup/GCP_SETUP_GUIDE.md) — Copy-paste gcloud commands
- [GCP_DEPLOYMENT_STEPS.md](./setup/GCP_DEPLOYMENT_STEPS.md) — Architectuurbeslissing, volgorde
- [DEPLOYMENT_GCP.md](./setup/DEPLOYMENT_GCP.md) — Technische deployment details
- [DEPLOYMENT_GCP_MVP.md](./setup/DEPLOYMENT_GCP_MVP.md) — MVP: start/stop, beveiligen, psql check (Firebase nog niet actief)
- [DEPLOYMENT_AUTOMATION_NEXT_STEPS.md](./setup/DEPLOYMENT_AUTOMATION_NEXT_STEPS.md) — Ian: CI/CD next steps na auth

### architecture/ — Architectuur & specs
- [SUBSCRIPTION_TRACKER_SPECS.md](./architecture/SUBSCRIPTION_TRACKER_SPECS.md) — Product specs
- [API_CONTRACT.md](./architecture/API_CONTRACT.md) — API contract
- [GCP_ARCHITECTURE.md](./architecture/GCP_ARCHITECTURE.md) — Waarom Cloud Run + Cloud SQL
- [ARCHITECTURE.md](./architecture/ARCHITECTURE.md) — Algemene architectuur
- [MOCK_TO_GCP_MIGRATION.md](./architecture/MOCK_TO_GCP_MIGRATION.md) — Mock → GCP migratie

### security/ — Auth & security

**Root** (auth howto, roadmap):
- [MOCK_LOGIN.md](./security/MOCK_LOGIN.md) — Lokale dev zonder Firebase
- [FIREBASE_SECURE_SETUP.md](./security/FIREBASE_SECURE_SETUP.md) — Firebase Auth (productie)
- [SECURITY_IMPLEMENTATION_PLAN.md](./security/SECURITY_IMPLEMENTATION_PLAN.md) — Security roadmap

**design/** (design, threat model, implementatie):
- [SECURITY_DESIGN_PRODUCTION_GCP.md](./security/design/SECURITY_DESIGN_PRODUCTION_GCP.md) — Security design productie (PenPeter, Ian, Alex)
- [THREAT_MODEL_PRODUCTION_GCP.md](./security/design/THREAT_MODEL_PRODUCTION_GCP.md) — STRIDE threat model productie
- [IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md](./security/design/IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md) — Floyd + Fede: quick wins, KISS, security-by-default

**audits/** (reviews, audits):
- [SECURITY_ARCHITECTURE_REVIEW_SSO.md](./security/audits/SECURITY_ARCHITECTURE_REVIEW_SSO.md) — SSO review
- [SECURITY_REVIEW_GCP_DATABASE.md](./security/audits/SECURITY_REVIEW_GCP_DATABASE.md) — DB security
- [SECURITY_AUDIT_THEHAMMER_2026-02.md](./security/audits/SECURITY_AUDIT_THEHAMMER_2026-02.md) — @TheHammer audit + POC-evaluatie + werkinschatting
- [SECURITY_AUDIT_SPRINT3.md](./security/audits/SECURITY_AUDIT_SPRINT3.md) — Sprint 3 audit

### team/ — Team & protocol
- [TEAM_PROTOCOL.md](./team/TEAM_PROTOCOL.md) — Workflow, checkpoint, when-to-ask
- [VIRTUAL_TEAM_LESSONS_LEARNED.md](./team/VIRTUAL_TEAM_LESSONS_LEARNED.md) — Retro-notes
- [TEAM_SKILLS_IMPROVEMENT_PROPOSAL.md](./team/TEAM_SKILLS_IMPROVEMENT_PROPOSAL.md) — Skills voorstel
- [SPRINT_1.md](./team/SPRINT_1.md) … [SPRINT_7.md](./team/SPRINT_7.md) — Sprints
- [RETRO_2026-02.md](./team/RETRO_2026-02.md), [RETRO_2026-03.md](./team/RETRO_2026-03.md) — Retros

### reviews/ — Co-PM & QA
- [CO_PM_DOCS_ALIGNMENT_REVIEW.md](./reviews/CO_PM_DOCS_ALIGNMENT_REVIEW.md)
- [CO_PM_SKILLS_REVIEW.md](./reviews/CO_PM_SKILLS_REVIEW.md)
- [CO_PM_DOCS_REVIEW_GCP.md](./reviews/CO_PM_DOCS_REVIEW_GCP.md)
- [QA_REVIEW_*.md](./reviews/) — QA reviews
- [CODE_REVIEW_SPRINT2.md](./reviews/CODE_REVIEW_SPRINT2.md)
- [BUGS.md](./reviews/BUGS.md)

---

*Co-PM — Docs index*
