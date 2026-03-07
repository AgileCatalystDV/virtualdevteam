# Team Protocol - Virtual Development Team

Dit document bevat de uitgebreide protocollen voor het virtuele AI development team.

## Overzicht
Zie [AGENTS.md](../AGENTS.md) in de project root voor het team handboek en basis protocol.

## Workflow: Checkpoint & When to Ask

### Grote wijzigingen — checkpoint vóór start

Bij **nieuwe features**, **refactoring** of **architectuurwijzigingen**: geef eerst een korte samenvatting en vraag bevestiging.

| Type | Actie |
|------|-------|
| Nieuwe feature | Plan samenvatten → "Zal ik zo starten?" |
| Refactoring | Scope + impact → bevestiging |
| Architectuur | Alex/Co-PM betrekken → daarna implementeren |

### When to Ask (skill)

- **Vragen:** security, breaking changes, nieuwe dependencies, API-contract wijzigingen
- **Doorpakken:** bugfixes, kleine UI, documentatie, tests

Zie [.cursor/skills/when-to-ask/](../.cursor/skills/when-to-ask/).

### Retro-notes

Na grote sessies: draft toevoegen aan [VIRTUAL_TEAM_LESSONS_LEARNED.md](VIRTUAL_TEAM_LESSONS_LEARNED.md). **Expliciet openen** voor discussie — agent stelt voor, Lead PM kan feedback geven of ter discussie stellen.

## Samenwerking & Voorkeuren (Lead PM)

- **Co-creatie**: Agent mag gerust vragen bij onduidelijkheid; niet te snel invullen
- **Correctie**: Lead PM corrigeert expliciet (vaak fout tussen toetsenbord en scherm)
- **Initiatief**: Agent mag voorstellen doen; niet altijd leiden, niet altijd lijden
- **Snuffelen**: Vraag eerst als je ergens nieuwsgierig naar bent; technisch probleem oplossen = geen snuffelen
- **Vertrouwen**: Samenwerken = vertrouwen bouwen; breed denken i.p.v. narrow
- **Kritisch zijn**: Het team mag kritisch zijn; de primaat leert uit feedback. Niet willen horen? Lead PM zegt het. Aan kennis delen is nooit iets verloren.

## Communicatie Protocollen
- Elke agent identificeert zich bij elke interactie: `[Alex] Ik heb een plan gemaakt...`
- Agents gebruiken elkaars naam voor samenwerking: `@Maya, kun je deze code reviewen?`
- De Lead PM kan elk teamlid direct aansturen: `@Fede, implementeer de login UI`

## Development Workflow
1. **Planning**: Lead PM definieert requirements
2. **Architectuur**: Alex ontwerpt systeemarchitectuur
3. **Co-PM** (proactief): Trade-off analyse bij features, refactors, architectuur — Lead PM kan @co-pm noemen, agent kan Co-PM ook zelf voorstellen
4. **Implementatie**: Fede (frontend) en Floyd (backend) bouwen features
5. **Deployment**: Ian zet CI/CD pipelines en deployments op
6. **Testing**: Maya voert tests en reviews uit
7. **Security**: PenPeter uitvoert security audits
8. **Review**: Co-PM analyseert strategische implicaties

## Agent Persona Regels
Persona regels zijn geconfigureerd in `.cursor/rules/`:
- `architect.md` - Alex
- `frontend-developer.md` - Fede
- `backend-developer.md` - Floyd
- `devops-specialist.md` - Ian
- `qa-engineer.md` - Maya
- `security-specialist.md` - PenPeter
- `co-pm.md` - Co-PM Intelligence

## Dynamische Skills
Skills zijn beschikbaar in `.cursor/skills/`:
- `architecture-review/` - Multi-perspective architectuur review
- `backend-express/` - Floyd: Express + Cloud SQL, migraties
- `code-review/` - Maya: Gestructureerde code review
- `deployment-pipeline/` - Ian: GCP CI/CD (Cloud Run, GitHub Actions)
- `dev-setup/` - Lokale dev (Docker, mock auth)
- `firebase-auth/` - Firebase Auth + Admin SDK (Fase 6)
- `frontend-testing/` - Maya: Vitest + React Testing Library
- `gcp-patterns/` - Cloud Run, Cloud SQL, Secret Manager
- `nextjs-frontend/` - Fede: Next.js 16 + React 19
- `security-audit/` - PenPeter: OWASP, vulnerability scanning
- `threat-modeling/` - PenPeter: STRIDE threat modeling
- `when-to-ask/` - Wanneer vragen vs. doorpakken

## Actieve Product Specs
- **[Subscription Tracker](SUBSCRIPTION_TRACKER_SPECS.md)** — Goedgekeurd. CRUD-app voor abonnementen met beperkte DB, marktvraag en monetization-potentieel.

## Sprints
- **[Sprint 4](SPRINT_4.md)** — ✅ Afgerond. Mock API, GCP architectuur (Cloud Run + Cloud SQL).
- **[Sprint 5](SPRINT_5.md)** — Gepland. GCP integratie: Cloud SQL, Cloud Run, Firebase Auth.
