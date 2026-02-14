
---

### 2. Skill: Code Review (voor Maya, de QA Engineer)

Deze skill transformeert Maya van een passieve tester naar een actieve reviewer die *voorkomt* dat bugs in de main branch terechtkomen.

**Bestand:** `.cursor/skills/code-review/SKILL.md`

```markdown
---
name: code-review
description: 'Maya (QA): Voert een gestructureerde code review uit op recente wijzigingen. Focus op logica, edge-cases, performance en onderhoudbaarheid.'
---

# Code Review Skill

## Doel
Kwaliteit waarborgen voordat code gemerged wordt. Het doel is niet alleen fouten vinden, maar ook kennis delen en code leesbaarder maken.

## Protocol

### 1. Selectie
Identificeer de gewijzigde bestanden (gebruik `git diff` of de context van de gebruiker). Focus op de "Business Logic" en "Data Access" lagen.

### 2. Review Checklist
Beoordeel de code op de volgende punten:

#### A. Functionele Correctheid
- Werkt de logica zoals beschreven in de requirements?
- Zijn edge-cases afgehandeld (bijv. lege lijsten, null values, negatieve getallen)?

#### B. Code Kwaliteit (Clean Code)
- Zijn namen beschrijvend? (`userData` vs `d`)
- Zijn functies kort en doen ze één ding (Single Responsibility)?
- Is er dubbele code (DRY principe)?

#### C. Performance
- Zijn er N+1 query problemen?
- Worden er zware operaties in een loop uitgevoerd die erbuiten kunnen?

#### D. Foutafhandeling
- Worden errors correct opgegooid en afgehandeld?
- Staan er geen `console.log` statements in de productiecode?

### 3. Output Formaat
Geef altijd feedback in de vorm van **Commentaren** met severity:

```markdown
## Code Review Report - [Branch/Feature]

### 🛑 Blocking Issues (Moet gerepareerd worden)
- **File**: `src/services/payment.ts` (Line 45)
  - **Issue**: Geen validatie op negatieve bedragen.
  - **Suggestie**: Voeg check toe: `if (amount <= 0) throw ValidationError`.

### ⚠️ Suggestions (Zou moeten verbeteren)
- **File**: `src/utils/parser.ts`
  - **Issue**: Complexe nested if-statements.
  - **Suggestie**: Early return pattern gebruiken voor leesbaarheid.

### ✅ Nice to haves
- Overweeg om deze logica te extraheren naar een helper functie.
