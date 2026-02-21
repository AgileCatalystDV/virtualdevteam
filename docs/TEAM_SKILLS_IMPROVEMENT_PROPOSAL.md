# Team Skills & Samenwerking — Verbetervoorstel

**Auteur**: Co-PM Intelligence (synthese na overleg met alle personae)  
**Datum**: 2026-02-15  
**Context**: Multisprint review, trainingsbehoeften, "aanvoelen" van het project

---

## 🎯 Aanleiding

Lead PM vroeg: *Hebben jullie trainingsbehoeften? Skills die je per persona zou willen veranderen?*

Co-PM heeft alle rollen bevraagd op basis van hun ervaring met Subscription Tracker, GCP-setup, dev workflow en Digital Companion. Dit document bundelt de input en formuleert een verbetervoorstel.

---

## 📋 Input per persona

### Alex (Architect)

**Aanvoelen**: "We schrijven veel docs (GCP_ARCHITECTURE, SECURITY_REVIEW, MOCK_TO_GCP). Dat werkt. Maar mijn rules zijn generiek — weinig over cloud-native patterns."

**Trainingsbehoefte**:
- **GCP-architectuurpatronen**: Cloud Run, Cloud SQL, Secret Manager — wanneer wat, trade-offs
- **Docs-first design**: Template voor "architectuur → security review → implementatie" flow
- **MVP vs scale**: Duidelijker wanneer enterprise-patterns te introduceren

---

### Fede (Frontend Developer)

**Aanvoelen**: "Next.js 16, React 19, Firebase Auth — de stack evolueert. API client pattern werkt goed. Maar ik mis richtlijnen voor auth-state in de UI."

**Trainingsbehoefte**:
- **Firebase Auth + Next.js**: Session handling, protected routes, token refresh
- **API client patterns**: Auth header injectie, error handling, loading states
- **Zustand vs React Query**: Wanneer welke voor server state (we gebruiken nu ApiDataProvider)

---

### Floyd (Backend Developer)

**Aanvoelen**: "Express 5, Cloud SQL, migrations — het past. Maar connection pooling, Unix socket, Firebase Admin SDK zijn nieuw voor mij in deze context."

**Trainingsbehoefte**:
- **Cloud SQL connection patterns**: Unix socket vs TCP, connection pooling in serverless
- **Firebase Admin SDK**: Token verify, user sync naar DB
- **Migration workflow**: Run order, rollback, seed data

---

### Ian (DevSecOps)

**Aanvoelen**: "We doen veel handmatig (GCP_SETUP_GUIDE, DEV_SETUP). Docker Compose voor dev was een goede toevoeging. Mijn rules zijn K8s/AWS-georiënteerd — dit project is GCP + Cloud Run."

**Trainingsbehoefte**:
- **GCP-specifiek**: Cloud Run, Cloud SQL, Secret Manager, IAM — copy-paste patterns
- **Dev-prod parity**: Docker Compose ↔ Cloud SQL, env var strategy
- **Handmatig → CI/CD**: Wanneer GitHub Actions toevoegen, wat eerst automatiseren

---

### Maya (QA Engineer)

**Aanvoelen**: "Code review en test strategy zijn duidelijk. Maar integration tests met echte DB ontbreken. Mock vs real — wanneer welke?"

**Trainingsbehoefte**:
- **Integration testing**: Testen tegen Docker Postgres, cleanup, fixtures
- **API contract testing**: Pact of handmatige contract checks
- **Code review checklist**: Next.js/Express-specifiek (niet alleen generiek)

---

### PenPeter (Security Specialist)

**Aanvoelen**: "GCP security (IAM, Secret Manager, Cloud SQL) is nieuw. OWASP web is bekend. Firebase Auth flow heb ik gereviewd."

**Trainingsbehoefte**:
- **GCP security**: IAM least privilege, Secret Manager best practices, Cloud SQL hardening
- **Firebase Auth security**: Token verification, session hijacking preventie
- **Cloud-native threat model**: STRIDE voor serverless (Cloud Run, managed DB)

---

### Co-PM Intelligence

**Aanvoelen**: "Docs review (CO_PM_DOCS_REVIEW_GCP) en risk assessment werken. Ik mis een gestructureerde sprint-retro format en cross-project learning."

**Trainingsbehoefte**:
- **Sprint retro format**: Wat ging goed, wat niet, acties — template voor Lead PM
- **Cost-risk analysis**: Cloud cost raming, wat als traffic 10x stijgt
- **Cross-project**: Digital Companion vs Subscription Tracker — herbruikbare patterns documenteren

---

## 🏆 Verbetervoorstel — Multisprint

### Sprint A: Project-specifieke skills (1–2 weken)

| # | Actie | Verantwoordelijke | Output |
|---|-------|------------------|--------|
| 1 | **Skill: gcp-patterns** | Ian + Alex | SKILL.md: Cloud Run, Cloud SQL, Secret Manager — wanneer, hoe, troubleshooting |
| 2 | **Skill: dev-setup** | Ian | SKILL.md: Docker Compose, localhost, env vars — dev workflow |
| 3 | **Skill: firebase-auth-backend** | Floyd + PenPeter | SKILL.md: Firebase Admin SDK, token verify, user sync |
| 4 | **Skill: firebase-auth-frontend** | Fede | SKILL.md: signIn, session, protected routes, token refresh |

### Sprint B: Rules compacter + project-gebaseerd (1 week)

| # | Actie | Verantwoordelijke | Output |
|---|-------|------------------|--------|
| 5 | **Rules trimmen** | Co-PM | Alle personae < 50 regels; focus op rol, NIET, samenwerking |
| 6 | **Project rules** | Alex | `.cursorrules`: commands (npm, docker), code style, pointers |
| 7 | **Commands** | Ian | `/review-pr`, `/deploy-check` — zie digitalcompanion model |

### Sprint C: Samenwerking & retro (doorlopend)

| # | Actie | Verantwoordelijke | Output |
|---|-------|------------------|--------|
| 8 | **Sprint retro template** | Co-PM | Template: goed/niet goed/acties — voor Lead PM |
| 9 | **Architecture review flow** | Alex + Co-PM | Wanneer multi-perspective review; wie wanneer |
| 10 | **Cross-project doc** | Co-PM | Welke patterns herbruikbaar (Rules/Skills/Commands, GCP) |

---

## 📐 Prioriteit (Co-PM aanbeveling)

| Prioriteit | Actie | Reden |
|------------|-------|-------|
| **P0** | Skill: gcp-patterns | ✅ **Gereed** — `.cursor/skills/gcp-patterns/` |
| **P0** | Skill: dev-setup | ✅ **Gereed** — `.cursor/skills/dev-setup/` |
| **P1** | Rules trimmen | CO_PM_RESEARCH: max 300–400 regels totaal |
| **P1** | Commands | `/review-pr`, `/deploy-check` — snellere workflows |
| **P2** | Firebase skills | Relevant zodra token verify live is |
| **P2** | Sprint retro template | Structuur voor leren van sprints |

---

## 🤝 Samenwerkingsprincipes (team-aanvoelen)

Uit de gesprekken kwamen deze principes naar voren:

1. **Docs first** — Architectuur en setup docs werken; blijven investeren
2. **Dev-prod parity** — Docker lokaal ≈ Cloud SQL; zelfde migrations
3. **Security early** — PenPeter bij architectuur (niet alleen na implementatie)
4. **Lead PM centraal** — Zelf setup doen (GCP, dev) vraagt duidelijke guides
5. **KISS** — Eerst handmatig, dan automatiseren (CI/CD niet te vroeg)

---

## ✅ Volgende stappen

1. **Lead PM**: Prioriteer welke acties eerst (P0/P1/P2)
2. **Ian**: Start met gcp-patterns en dev-setup skills
3. **Co-PM**: Maak sprint retro template; plan rules-trim sessie
4. **Team**: Gebruik nieuwe skills bij volgende GCP/dev taken; itereren op basis van gebruik

---

*Co-PM Intelligence — Team Skills Improvement Proposal — Synthese na persona-overleg*
