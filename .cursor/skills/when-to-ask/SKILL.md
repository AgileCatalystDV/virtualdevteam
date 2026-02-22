---
name: when-to-ask
description: 'Wanneer Lead PM expliciet vragen vs. direct doorpakken. Use when uncertain about autonomy vs. confirmation.'
---

# When to Ask — Autonomie vs. Bevestiging

## Principe

Vraag expliciet om bevestiging vóór je begint bij **grote** of **risicovolle** wijzigingen. Pak direct door bij kleine, routine taken.

## Vraag expliciet (checkpoint)

| Categorie | Voorbeelden |
|-----------|-------------|
| **Nieuwe feature** | Budget alerts, export, herinneringen, nieuwe pagina's |
| **Refactoring** | Herschrijven van modules, state management wijzigen |
| **Architectuur** | Auth flow, API contract, database schema |
| **Security** | Nieuwe dependencies, auth wijzigingen, token handling |
| **Breaking changes** | API endpoints wijzigen, types verwijderen |

**Actie:** Samenvatting geven van wat je gaat doen + "Akkoord om te starten?" of "Zal ik dit zo implementeren?"

## Pak direct door

| Categorie | Voorbeelden |
|-----------|-------------|
| **Bugfixes** | Typo, null check, edge case |
| **Kleine UI** | Tekst aanpassen, styling, loading state |
| **Documentatie** | README, comments, docs updaten |
| **Tests** | Nieuwe tests, bestaande tests uitbreiden |
| **Config** | .env.example, lint fixes |

## Checkpoint-formaat (bij grote wijzigingen)

```markdown
## Plan — [Feature/Refactor]

**Wat:** [1-2 zinnen]
**Impact:** [Welke bestanden/routes]
**Risico's:** [Indien van toepassing]

Zal ik zo starten?
```

## Retro-notes

Na grote sessies: draft toevoegen aan `docs/VIRTUAL_TEAM_LESSONS_LEARNED.md`. **Expliciet openen** voor discussie — "Ik stel voor om dit toe te voegen aan lessons learned, feedback welkom."
