# Security Inspection — Terminal Activity

**Reviewer**: PenPeter (Security Specialist)  
**Datum**: 2026-02-15  
**Aanleiding**: Lead PM — "lijkt of er vanalles wordt geïnstalleerd dat mogelijk ongewenst is"

---

## Analyse Terminal 1

### Wat er gebeurde

1. **Homebrew search output** (regels 1–525)  
   - Uitvoer van `brew search` of vergelijkbaar: lijsten van formulenamen en beschrijvingen (radicle, ralph-orchestrator, redu, rustledger, etc.)
   - **Geen installatie** — alleen zoekresultaten
   - Waarschijnlijk per ongeluk getypt of geactiveerd (bv. incomplete commando)

2. **`brew install postgresql@16`** (regels 526–600)  
   - Bewuste installatie voor DEV_SETUP (Optie B — localhost Postgres)
   - Dependencies: libunistring, gettext, icu4c@78, ca-certificates, openssl@3, krb5, lz4, readline, xz, cmake, zstd
   - Dit zijn standaard PostgreSQL-dependencies
   - **Afgebroken** met Ctrl+C tijdens `make check` (libunistring)

### Beoordeling

| Item | Status |
|------|--------|
| Homebrew search output | Geen installatie, alleen zoekresultaten |
| postgresql@16 + deps | Verwachte, legitieme dependencies voor PostgreSQL |
| Ongewenste packages | Geen aanwijzingen |

---

## Analyse Terminal 2 (npm install)

### Wat er gebeurde

- `npm install` in `subscription-tracker/` (test dependencies: Vitest, @testing-library/*, jsdom)
- 97 packages toegevoegd (incl. transitive deps)
- **20 vulnerabilities** (6 moderate, 14 high)

### Beoordeling

| Item | Status |
|------|--------|
| Doel van install | Testdependencies voor frontend tests |
| Ongewenste packages | Geen; allemaal devDependencies voor testing |
| Vulnerabilities | Aandachtspunt — zie hieronder |

---

## Aanbevelingen

### 1. Homebrew search-output

- Geen actie nodig
- Geen installaties door deze output
- Tip: bij twijfel `brew list` gebruiken om te zien wat er geïnstalleerd is

### 2. PostgreSQL-installatie

- Als je localhost Postgres wilt gebruiken: `brew install postgresql@16` opnieuw uitvoeren en laten afronden
- Als je Docker gebruikt: PostgreSQL via Homebrew niet nodig

### 3. npm vulnerabilities

```bash
cd subscription-tracker
npm audit
npm audit fix   # voor niet-breaking fixes
```

- `npm audit fix --force` kan breaking changes geven — eerst `npm audit` bekijken
- DevDependencies (Vitest, RTL) draaien niet in productie; risico is beperkt tot development

### 4. Voorkomen van onbedoelde installaties

- Controleer commando’s vóór Enter
- Gebruik `--dry-run` waar mogelijk (bv. `npm install --dry-run`)
- Voor Homebrew: `brew install X` alleen uitvoeren als X bewust gekozen is

---

## Conclusie

**Geen ongewenste installaties vastgesteld.**  
De Homebrew-output betreft zoekresultaten, niet installaties. De PostgreSQL-installatie en npm-packages zijn bewust en passend bij DEV_SETUP en frontend testing. Enige aandachtspunt: de 20 npm-vulnerabilities — uitvoeren van `npm audit` en `npm audit fix` wordt aanbevolen.

---

*PenPeter — Security Specialist — Terminal Inspection*
