---
name: threat-modeling
description: 'PenPeter (Security): Voert een Threat Modeling sessie uit (STRIDE) op een feature of architectuur. Identificeert aanvalsvectoren voordat er code geschreven wordt.'
---

# Threat Modeling Skill

## Doel
Security problemen vroeg in het ontwikkelproces ontdekken (Security Shift-Left). We denken als een aanvaller: "Hoe kan ik dit systeem misbruiken?"

## Methode: STRIDE
We analyseren elke component op de volgende risico's:
- **S**poofing (Identiteitsdiefstal)
- **T**ampering (Data manipulatie)
- **R**epudiation (Ontkenning van acties)
- **I**nformation Disclosure (Data lekken)
- **D**enial of Service (Beschikbaarheid)
- **E**levation of Privilege (Rechten escaleren)

## Proces

### Stap 1: Scope Bepalen
Vraag de gebruiker: "Welke feature of architectuur wil ik analyseren?" (bijv. `@PenPeter threat model de login flow`).

### Stap 2: Data Flow Diagram (Mentaal of Schets)
Identificeer:
- **Boundaries**: Waar verlaat data de vertrouwde zone? (Internet -> API)
- **Assets**: Wat wil de aanvaller stelen? (User tokens, PII data)
- **Actors**: Wie interageert met het systeem? (User, Admin, External API)

### Stap 3: Analyse per STRIDE element
Loop de elementen langs en formuleer specifieke aanvallen.

### Stap 4: Mitigaties
Vertaal de bedreigingen naar concrete architectuur-wijzigingen of code-eisen.

## Output Voorbeeld
```markdown
# Threat Model: User Login Flow

## 🎯 Assets
- User Credentials (Email/Password)
- Session Token (JWT)

## 🚨 Geïdentificeerde Bedreigingen

### 1. Brute Force Attack (Spoofing)
- **Risk**: Een aanvaller probeert miljoenen wachtwoorden.
- **Mitigation**: Implementeer Rate Limiting (5 pogingen per minuut) en CAPTCHA.

### 2. Credential Stuffing (Spoofing)
- **Risk**: Aanvaller gebruikt gelekte wachtwoorden van andere sites.
- **Mitigation**: Dwing sterk wachtwoord beleid af en check against 'Have I Been Pwned' database.

### 3. Session Hijacking (Information Disclosure)
- **Risk**: Token gestolen via XSS of onveilige verbinding.
- **Mitigation**: 
  - Zet `HttpOnly` en `Secure` flags op cookies.
  - Bind sessie aan IP-address of User-Agent fingerprint.

### 4. SQL Injection (Tampering/Elevation)
- **Risk**: Bypass login via SQL injectie.
- **Mitigation**: Gebruik **altijd** parameterized queries (ORM of prepared statements).
```
