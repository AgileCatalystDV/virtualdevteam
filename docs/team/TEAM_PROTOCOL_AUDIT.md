# Team Protocol Audit — Projectsetup & Samenwerkingsmodel

**Auteur**: Co-PM Intelligence  
**Datum**: 2026-03-08  
**Referentiekader**: Cursor Best Practices (2026), DORA 2025, single-agent onderzoek (Towards AI, Feb 2026)

---

## Verdict: ✅ GOEDGEKEURD — met gerichte verbeteringen

Het samenwerkingsmodel is **goed doordacht en effectief**. De mono-agent keuze is niet alleen pragmatisch maar ook wetenschappelijk verdedigbaar. Hieronder de onderbouwing en verbeteringsideeën.

---

## Wat werkt goed (en waarom)

### 1. Mono-agent is de juiste keuze voor dit project

Recent onderzoek (Towards AI, Feb 2026) bevestigt wat intuïtief gedaan werd:

> *"70% of 'multi-agent' projects end up being better solved with a single well-designed agent."*

Multi-agent systemen degraderen 39–70% op **sequentiële redenering** — precies het soort werk dat hier gedaan wordt (architectuur → implementatie → security). De "single-threaded primate" inzicht is dus fundamenteel correct en door data ondersteund.

### 2. Persona's als context-activatoren werken

De combinatie van `AGENTS.md` + `.cursor/rules/*.md` + `@-mentions` is in lijn met de **Cursor best practices**:

> *"Rules provide persistent instructions that shape how the agent works."*

De zeven persona-rules fungeren als contextvensters die per interactie de juiste "expertise" activeren. Dit is een elegante implementatie van wat Cursor "static context" noemt — zonder multi-agent overhead.

### 3. Skills zijn correct ingezet

De scheiding Skills (dynamisch, on-demand) vs. Rules (altijd actief) klopt perfect met de Cursor architectuur. Het gebruik van Skills voor `deployment-pipeline`, `security-audit`, `threat-modeling` etc. is het schoolvoorbeeld van wat Cursor bedoelt:

> *"Unlike Rules which are always included, Skills are loaded dynamically when the agent decides they're relevant."*

### 4. HITL + Checkpoints zijn evidence-based

DORA 2025 concludeert dat AI een **amplifier** is — het vergroot sterke punten maar ook zwakke. Het checkpoint-protocol (plan → bevestiging Lead PM → implementatie) is precies het soort HITL dat slechte AI-output voorkomt.

### 5. Anti-perfectionisme als expliciete waarde

> *"Orchestrator zegt 'stop, ship it', 'later sprint', 'goed genoeg'"* — Lessons Learned

Dit is zeldzaam goed. De meeste AI-projecten stranden in over-engineering. De expliciete "KISS + security-by-default" beslissing in Sprint 6 is een best practice die zelden gedocumenteerd wordt.

---

## Verbeteringsideeën

### 🔴 P0 — Quick wins (klein, hoge impact)

**A) `.cursor/plans/` — bewaar plannen bij grote features**

Cursor adviseert Plan Mode (`Shift+Tab`) en opslaan in `.cursor/plans/`. Bij Sprint 7 (Firebase Auth) is dit zeer waardevol:

- Plan vóór coderen: "@Floyd, stap 1 is X, stap 2 is Y"
- Bewaar het plan → context bij volgende gesprek
- Voorkomt "agent lost focus after many turns"

Concrete suggestie: maak `.cursor/plans/` aan en documenteer het Firebase Auth plan daarin vóór implementatie.

**B) Gestructureerde conversation reset-triggers**

Cursor's blog waarschuwt expliciet:

> *"Long conversations can cause the agent to lose focus... If you notice effectiveness decreasing, start a new conversation."*

Dit wordt impliciet gedaan (samenvatting aan begin), maar maak het **expliciet protocol**. Voeg toe aan `TEAM_PROTOCOL.md`:

```markdown
## Conversation Management
- Nieuwe chat bij: nieuwe feature, sprint start, na retro
- Meegeven: "Lees de context samenvatting in [AGENTS.md, TEAM_PROTOCOL.md, SPRINT_X.md]"
- @Past Chats voor referentie aan eerdere beslissingen
```

### 🟡 P1 — Structurele verbeteringen

**C) `.cursor/commands/` — herhaalbare workflows**

Jullie hebben al goede documentatie van commando's in `.md` files. Cursor heeft nu een native feature: **Commands** als `/` triggers. Kandidaten voor dit project:

```markdown
# .cursor/commands/deploy-frontend.md
Deploy frontend to Cloud Run with NEXT_PUBLIC_API_URL.

1. Check the API URL in DEPLOYMENT_GCP_MVP.md
2. Run: gcloud builds submit --config cloudbuild.yaml --substitutions=_API_URL=...
3. Verify the deployment with gcloud run services describe
```

Dit reduceert documentatie-lookup tijd en voorkomt fouten.

**D) Expliciete "Skills zijn stale" detectie**

Huidig model: Skills worden bijgewerkt wanneer de agent een web search doet. Dit is **reactief**. Verbeter naar proactief: voeg aan elke Skill een `last_verified` datum toe en maak het protocol dat Maya bij elke sprint-start de relevante Skills verifieert.

**E) Gestructureerde sprint-retrospect → rule update**

Cursor adviseert:

> *"When you see the agent make a mistake, update the rule."*

Het Lessons Learned proces doet dit al informeel. Maak het formeel: elke retro eindigt met de vraag "Welke rule/skill moet geupdated worden op basis van deze sprint?"

### 🟢 P2 — Toekomst (post Sprint 7)

**F) MCP integratie (na Firebase Auth)**

Nu werkende authenticatie er is, wordt MCP interessant. Specifiek voor dit project:

- **GitHub MCP**: agent kan issues lezen/schrijven, PRs aanmaken en reviewen
- **PostgreSQL MCP**: Floyd kan direct query's uitvoeren, schema bekijken
- **Secret Manager MCP**: Ian kan secrets beheren zonder copy-paste

Dit is een natuurlijke evolutie van de huidige toolset, geen big bang.

**G) Parallel agents voor reviews (bewust optioneel)**

Cursor ondersteunt native parallel agents via git worktrees. Voor dit project **niet aangeraden** als default (mono-agent is correct), maar wel waardevol voor kritische, complexe features zoals:

- "Laat twee modellen dezelfde Firebase Auth implementatie doen en vergelijk"

---

## Gaps in de documentatie

| Gap | Impact | Fix |
|-----|--------|-----|
| Geen expliciete "conversation reset" protocol | Medium | Toevoegen aan `TEAM_PROTOCOL.md` |
| Skills hebben geen `last_verified` datum | Low | 1 regel per Skill toevoegen |
| Geen `.cursor/plans/` conventie | Medium | Aanmaken + protocol |
| Git trailer bug nog niet structureel opgelost | Low | `git config --global --list` → unset trailer. Retro actie #2 staat open. |

---

## Samenvattend oordeel

| Dimensie | Score | Motivatie |
|----------|-------|-----------|
| Architectuur (mono-agent) | ✅ 9/10 | Evidence-based, correct voor projectomvang |
| Persistente context | ✅ 8/10 | AGENTS.md + Skills + Rules is best practice |
| HITL-orchestratie | ✅ 9/10 | Checkpoints, anti-perfectionisme, Lead PM steering |
| Security-proces | ✅ 8/10 | STRIDE, quick wins, KISS — goed gebalanceerd |
| Conversation management | ⚠️ 6/10 | Impliciet werkt, maar geen formeel protocol |
| Herhaalbare workflows | ⚠️ 6/10 | Goed in docs, maar `.cursor/commands/` niet benut |
| Skill maintenance | ⚠️ 6/10 | Geen `last_verified`, reactief i.p.v. proactief |

**Totaal: het model werkt en is volwassen voor de projectfase.** De verbeteringen zijn incrementeel — geen paradigmawisseling nodig. DORA 2025's conclusie dat AI een *amplifier* is, geldt hier: de sterke HITL-orchestratie van de Lead PM maakt dit model effectief. Dezelfde techniek met een zwakkere orchestrator zou veel minder opleveren.

---

## Referenties

- [Cursor Agent Best Practices](https://cursor.com/blog/agent-best-practices) — Plan Mode, context management, Skills vs Rules
- [DORA 2025 State of AI-assisted Software Development](https://dora.dev/research/2025/dora-report/) — AI als amplifier, HITL
- [Multi-Agent vs Single-Agent (Towards AI, Feb 2026)](https://pub.towardsai.net/multi-agent-or-single-agent-a-practitioners-guide-to-choosing-the-right-architecture-e1f489917156) — 70% single agent beter
- [VIRTUAL_TEAM_LESSONS_LEARNED.md](./VIRTUAL_TEAM_LESSONS_LEARNED.md) — Eigen project ervaring
- [TEAM_PROTOCOL.md](./TEAM_PROTOCOL.md) — Huidig protocol

---

*Co-PM Intelligence — Team Protocol Audit — 2026-02-28*
