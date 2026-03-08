# Virtual AI Team — Lessons Learned & Best Practices

**Auteur**: Co-PM Intelligence  
**Datum**: 2026-02  
**Bron**: Onderzoek (DORA 2025, O'Reilly, Martin Fowler, HITL frameworks) + eigen ervaring Subscription Tracker

---

## Samenvatting

Een virtueel AI-team werkt effectief wanneer **capability in het team** wordt gecombineerd met **sterke HITL-orchestratie**. Zonder orchestrator loopt het vast in perfectionisme of richtingloosheid.

---

## 1. Waarom het werkt

### Capability in het team
- **Rolstructuur** (Alex, Fede, Floyd, Ian, Maya, PenPeter) geeft duidelijke expertise per domein
- **Skills** per rol (dev-setup, security-audit, frontend-testing) houden kennis actueel
- **AGENTS.md** als single source of truth voor wie wat doet

### HITL-orchestratie
- **Lead PM** stuurt: wie, wat, wanneer
- **Expliciete prioriteiten**: "implementatieplan voor later sprint", "nu verder met DEV_SETUP"
- **Grenzen stellen**: "max 4 queries per member", "unbiased, neutral"

### Onderzoek ondersteunt dit
- DORA 2025: AI is een **amplifier** — versterkt zowel sterke als zwakke punten van het team
- HITL-frameworks: menselijke goedkeuring op kritieke beslispunten voorkomt runaway automation
- Turing/HBR: 60% cost reduction + 90% model-expert agreement bij goed georkestreerde HITL

---

## 2. Valkuilen

### Perfectionisme (LLM + 10x-programmeurs)
- LLMs neigen naar over-engineering, te veel edge cases, eindeloze documentatie
- **Rem**: Orchestrator zegt "stop, ship it", "later sprint", "goed genoeg"

### Richtingloosheid
- Zonder sturing kiest het team zelf prioriteiten — vaak suboptimaal
- **Rem**: Expliciete instructies: "@Maya @Fede take the floor", "@PenPeter security review"

### Qualiteit vs. snelheid
- Cursor/agentic tools: hogere korte-termijn velocity, maar meer static analysis warnings (onderzoek 2024)
- **Rem**: QA (Maya) en code reviews blijven essentieel; HITL valideert output

### Contextverlies
- LLMs hebben geen langlopend geheugen van het project
- **Rem**: Skills, docs, AGENTS.md als persistente context; orchestrator herinnert aan "waarom toen zo"

---

## 3. Best Practices

### Orchestrator profiel
De Lead PM / orchestrator heeft idealiter:
- **TechLead-begrip** — kan technische sturing doen, over-engineering herkennen
- **Business-besef** — weet wanneer "done" voldoende is
- **Anti-perfectionisme** — remt eindeloze optimalisatie, zegt "goed genoeg"

### Team setup
- **Duidelijke rollen** — geen overlap, geen verwarring
- **Skills als levende docs** — update bij nieuwe info (web search → skill update)
- **Protocol** — AGENTS.md, @-mentions, identificeer je bij elke interactie

### Workflow
- **Expliciete prioriteiten** — niet alles tegelijk; "nu X, later Y"
- **Grenzen** — "max 4 queries", "max 2 agents parallel"
- **Feedback loops** — orchestrator corrigeert bijsturing; team past zich aan

### Kwaliteit
- **Testing** — LLM engineering vereist nog steeds rigoureuze tests (Martin Fowler, O'Reilly)
- **Refactoring** — behoud software-architectuur; geen "alleen prompt engineering"
- **Code review** — Maya blijft kritisch; HITL valideert output

---

## 4. Eigen ervaring (Subscription Tracker)

| Wat werkte | Voorbeeld |
|------------|-----------|
| Rol-specifieke instructies | "@Fede implementeer icons", "@Ian dev setup" |
| Uitstel van scope | "Security plan voor later sprint" |
| Snel bijsturen | Clearbit → Google Favicon, psql → docker exec |
| Skills-update | 4 web searches → 4 skills bijgewerkt |
| Perfectionisme remmen | "max 4 queries", "ik ga nu verder met DEV_SETUP" |

| Wat niet werkte | Oplossing |
|-----------------|-----------|
| Clearbit API | Externe API's kunnen deprecaten; fallback (Google Favicon) |
| Root package-lock.json | Verwarring bij module resolution; verwijderen |
| Git commit (trailer) | ✅ Opgelost — `brew upgrade git` → 2.53.0 (2026-03-08). Was: handmatige commit/push workaround. Root cause: git 2.14.3 kende `--trailer` niet. Zie [RETRO_2026-03.md](RETRO_2026-03.md) actie #3. |

### 2026-02-28 — GCP setup + docs herstructurering (Retro approved)

- **Wat:** GCP all the way beslissing, Lead PM stappenplan, docs in subfolders (setup/architecture/security/team/reviews), skills review
- **Lering:** Sparring (Ian + Alex) helpt bij onzekerheid; Co-PM docs alignment voorkomt drift
- **Prioriteit:** GCP deploy eerst; geen extra features parallel — Lead PM focust op rode item
- **Git commit trailer:** ✅ Opgelost — `brew upgrade git` → 2.53.0 (2026-03-08). Tech debt afgehandeld.

### 2026-03-08 — Sprint 6 afgerond, security hardening, retro 2 (Retro approved)

- **Wat:** GCP deploy live, Bill Shock, Cloud SQL stop/start, CORS + Helmet, threat model, security design, deployment automation next steps, security subdirs (design/audits/)
- **Lering:** Co-creatie werkt —zelfde model, verschillende rollen; Lead PM uitermate tevreden over samenwerkingsmodel. KISS + security-by-default door hele keten (Floyd, Fede, PenPeter)
- **Setup:** Geen subdirs — 7 bestanden nog overzichtelijk; wachten tot nodig
- **Zie:** [RETRO_2026-03.md](RETRO_2026-03.md)

---

## 5. Retro-notes proces

Na grote sessies kan de agent een **draft** toevoegen aan dit document. De agent opent dit **expliciet** voor discussie: "Ik stel voor om het volgende toe te voegen aan lessons learned, feedback welkom."

De Lead PM kan:
- Akkoord geven (draft blijft)
- Aanpassen of aanvullen
- Ter discussie stellen in de chat

**Voorbeeld draft:**
```markdown
### [Datum] — [Korte titel]
- **Wat:** [Beschrijving]
- **Lering:** [Wat we meenemen]
- **Open vraag:** [Indien van toepassing]
```

---

## 6. Referenties

- [TEAM_PROTOCOL.md](TEAM_PROTOCOL.md) — Checkpoint, when-to-ask, Co-PM
- [DORA 2025 State of AI-assisted Software Development](https://dora.dev/research/2025/dora-report/)
- [HBR: Set Your Team Up to Collaborate with AI](https://hbr.org/2024/11/set-your-team-up-to-collaborate-with-ai-successfully)
- [O'Reilly: What We Learned from a Year of Building with LLMs](https://oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-i)
- [Martin Fowler: Engineering Practices for LLM Applications](https://martinfowler.com/articles/engineering-practices-llm.html)
- [Turing: Human-in-the-Loop AI in Practice](https://www.turing.com/resources/from-bottlenecks-to-flywheels-human-in-the-loop-ai-in-practice)

---

*Co-PM — Lessons Learned — Virtual Team*
