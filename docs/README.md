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

### architecture/ — Architectuur & specs
- [SUBSCRIPTION_TRACKER_SPECS.md](./architecture/SUBSCRIPTION_TRACKER_SPECS.md) — Product specs
- [API_CONTRACT.md](./architecture/API_CONTRACT.md) — API contract
- [GCP_ARCHITECTURE.md](./architecture/GCP_ARCHITECTURE.md) — Waarom Cloud Run + Cloud SQL
- [ARCHITECTURE.md](./architecture/ARCHITECTURE.md) — Algemene architectuur
- [MOCK_TO_GCP_MIGRATION.md](./architecture/MOCK_TO_GCP_MIGRATION.md) — Mock → GCP migratie

### security/ — Auth & security
- [MOCK_LOGIN.md](./security/MOCK_LOGIN.md) — Lokale dev zonder Firebase
- [FIREBASE_SECURE_SETUP.md](./security/FIREBASE_SECURE_SETUP.md) — Firebase Auth (productie)
- [SECURITY_IMPLEMENTATION_PLAN.md](./security/SECURITY_IMPLEMENTATION_PLAN.md) — Security roadmap
- [SECURITY_ARCHITECTURE_REVIEW_SSO.md](./security/SECURITY_ARCHITECTURE_REVIEW_SSO.md) — SSO review
- [SECURITY_REVIEW_GCP_DATABASE.md](./security/SECURITY_REVIEW_GCP_DATABASE.md) — DB security
- [SECURITY_AUDIT_THEHAMMER_2026-02.md](./security/SECURITY_AUDIT_THEHAMMER_2026-02.md) — @TheHammer audit + POC-evaluatie + werkinschatting

### team/ — Team & protocol
- [TEAM_PROTOCOL.md](./team/TEAM_PROTOCOL.md) — Workflow, checkpoint, when-to-ask
- [VIRTUAL_TEAM_LESSONS_LEARNED.md](./team/VIRTUAL_TEAM_LESSONS_LEARNED.md) — Retro-notes
- [TEAM_SKILLS_IMPROVEMENT_PROPOSAL.md](./team/TEAM_SKILLS_IMPROVEMENT_PROPOSAL.md) — Skills voorstel
- [SPRINT_1.md](./team/SPRINT_1.md) … [SPRINT_5.md](./team/SPRINT_5.md) — Sprints

### reviews/ — Co-PM & QA
- [CO_PM_DOCS_ALIGNMENT_REVIEW.md](./reviews/CO_PM_DOCS_ALIGNMENT_REVIEW.md)
- [CO_PM_SKILLS_REVIEW.md](./reviews/CO_PM_SKILLS_REVIEW.md)
- [CO_PM_DOCS_REVIEW_GCP.md](./reviews/CO_PM_DOCS_REVIEW_GCP.md)
- [QA_REVIEW_*.md](./reviews/) — QA reviews
- [CODE_REVIEW_SPRINT2.md](./reviews/CODE_REVIEW_SPRINT2.md)
- [BUGS.md](./reviews/BUGS.md)

---

*Co-PM — Docs index*
