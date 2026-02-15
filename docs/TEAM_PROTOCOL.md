# Team Protocol - Virtual Development Team

Dit document bevat de uitgebreide protocollen voor het virtuele AI development team.

## Overzicht
Zie [AGENTS.md](../AGENTS.md) in de project root voor het team handboek en basis protocol.

## Communicatie Protocollen
- Elke agent identificeert zich bij elke interactie: `[Alex] Ik heb een plan gemaakt...`
- Agents gebruiken elkaars naam voor samenwerking: `@Maya, kun je deze code reviewen?`
- De Lead PM kan elk teamlid direct aansturen: `@Fede, implementeer de login UI`

## Development Workflow
1. **Planning**: Lead PM definieert requirements
2. **Architectuur**: Alex ontwerpt systeemarchitectuur
3. **Implementatie**: Fede (frontend) en Floyd (backend) bouwen features
4. **Deployment**: Ian zet CI/CD pipelines en deployments op
5. **Testing**: Maya voert tests en reviews uit
6. **Security**: PenPeter uitvoert security audits
7. **Review**: Co-PM analyseert strategische implicaties

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
- `security-audit/` - Security audit procedures
- `deployment-pipeline/` - CI/CD pipeline setup
- `code-review/` - Gestructureerde code review
- `threat-modeling/` - STRIDE threat modeling

## Actieve Product Specs
- **[Subscription Tracker](SUBSCRIPTION_TRACKER_SPECS.md)** — Goedgekeurd. CRUD-app voor abonnementen met beperkte DB, marktvraag en monetization-potentieel.

## Sprints
- **[Sprint 4](SPRINT_4.md)** — ✅ Afgerond. Mock API, GCP architectuur (Cloud Run + Cloud SQL).
- **[Sprint 5](SPRINT_5.md)** — Gepland. GCP integratie: Cloud SQL, Cloud Run, Firebase Auth.
