# Security & QA Audit — @TheHammer

**Auditor**: @TheHammer (Senior Security & QA Auditor)  
**Datum**: 2026-02-28  
**Scope**: api-backend/, subscription-tracker/, migrations  
**Context**: Sprint 5–6, POC/MVP, GCP deploy gepland

---

## 1. Audit Rapport — Technische Bevindingen

### 1.1 Kritieke Lekken

| # | Bevinding | Locatie | Impact |
|---|-----------|---------|--------|
| 1 | **Geen echte authenticatie in productie** | auth.js L17–31 | Als `AUTH_MODE !== "mock"` wordt Firebase nooit geverifieerd. `req.userId` blijft altijd `null`. Iedereen deelt anonieme namespace. |
| 2 | **Hardcoded mock token** | auth.js L11–12 | `mock-dev-token` + UUID hardcoded. Bij `AUTH_MODE=mock` in productie: iedereen kan impersoneren. |
| 3 | **CORS volledig open** | index.js L18 | `cors()` zonder origin → elke site kan API aanroepen. |
| 4 | **Geen rate limiting** | — | DoS, brute-force, massale POST-requests mogelijk. |
| 5 | **Token in sessionStorage** | login/page.tsx, ApiDataProvider | XSS kan token exfiltreren. |

### 1.2 Logische Fouten / Randgevallen

| # | Bevinding | Locatie | Impact |
|---|-----------|---------|--------|
| 6 | **Geen error handling bij mutaties** | ApiDataProvider | addSubscription, updateSub, removeSubscription hebben geen try/catch. Netwerkfout → unhandled rejection, geen feedback. |
| 7 | **Geen server-side input validatie** | subscriptions.js | Alleen `name` en `price` gecheckt. Geen lengte, type, whitelist voor billingCycle/categoryId/currency. DB constraints vangen af → generieke 500. |
| 8 | **Geen UUID-validatie voor req.params.id** | subscriptions.js | Ongeldige UUID → PostgreSQL error → 500. Geen expliciete 400. |
| 9 | **categories zonder auth** | categories.js | Publiek. Inconsistent met subscriptions (wel auth). |
| 10 | **Edit-pagina race** | [id]/edit/page.tsx | Directe URL vóór data load → "niet gevonden" zonder expliciete ownership-check. |

### 1.3 Security Verbeteringen (Best Practices)

| # | Bevinding | Locatie | Aanbeveling |
|---|-----------|---------|-------------|
| 11 | Geen Helmet | index.js | `X-Content-Type-Options`, `X-Frame-Options`, CSP, HSTS. |
| 12 | Geen body size limit | index.js | `express.json({ limit: "50kb" })` expliciet. |
| 13 | Geen globale error handler | — | `app.use((err, req, res, next) => ...)` voor onverwachte fouten. |
| 14 | Logging van volledige errors | subscriptions.js | `console.error(err)` kan stack traces in logs. Sanitize. |
| 15 | Geen path traversal check | — | Expliciete UUID-validatie voor `req.params.id`. |

---

## 2. Tweede Evaluatie — POC/MVP Context

### 2.1 Sprintplanning Context

- **Sprint 6**: GCP deploy (Lead PM aan het werk). Focus: app live op Cloud Run.
- **Retro 2026-02**: Geen extra features parallel. Morgen GCP deploy.
- **Sprint 5**: Firebase verify nog **Open** (taak 5). Mock flow werkt lokaal.
- **Doel nu**: POC/MVP live krijgen, niet productie-grade security.

### 2.2 Wat is Acceptabel voor POC/MVP?

| Bevinding | Acceptabel voor POC? | Reden |
|-----------|----------------------|-------|
| Geen Firebase verify in productie | **Ja, mits bewust** | Sprint 5 taak 5 staat open. GCP deploy kan met `AUTH_MODE=mock` of anonieme data. Documenteer dat dit **niet** productie is. |
| Hardcoded mock token | **Ja** | Alleen voor dev. **Nooit** `AUTH_MODE=mock` in productie (zie MOCK_LOGIN.md). |
| CORS open | **Tijdelijk** | Voor eerste deploy OK. Beperk zodra frontend URL bekend is (zie GCP_SETUP_GUIDE). |
| Geen rate limiting | **Ja** | POC-traffic laag. Niet kritiek voor demo. |
| Token in sessionStorage | **Ja** | Standaard voor SPA. XSS-risico blijft; POC heeft beperkte attack surface. |
| Geen error handling bij mutaties | **Nee** | UX-probleem. Gebruiker ziet niets bij fout. **Quick fix** mogelijk. |
| Geen server-side validatie | **Gedeeltelijk** | DB vangt af. 500 i.p.v. 400 is niet ideaal maar niet blokkerend. |
| Geen UUID-validatie | **Ja** | Edge case. 500 is acceptabel voor POC. |
| categories zonder auth | **Ja** | Publieke referentiedata. Correct. |
| Edit-pagina race | **Ja** | Edge case. "Niet gevonden" is acceptabel. |
| Geen Helmet | **Tijdelijk** | Nice-to-have. Niet blokkerend. |
| Geen body limit | **Ja** | Default 100kb voldoende. |
| Geen globale error handler | **Tijdelijk** | Try/catch in routes vangt meeste. |
| Logging | **Ja** | Cloud Logging is intern. Geen directe leak. |
| Path traversal | **Ja** | Parameterized queries. Laag risico. |

### 2.3 Conclusie POC/MVP

**De app is deploybaar als POC** met de volgende voorwaarden:

1. **Expliciet documenteren**: "POC — geen productie-auth. Niet geschikt voor echte gebruikersdata."
2. **AUTH_MODE**: In productie `AUTH_MODE` niet op `mock` zetten, tenzij bewust voor demo.
3. **CORS**: Na eerste deploy beperken tot frontend Cloud Run URL (één regel wijziging).
4. **Quick win**: Error handling bij mutaties (add/update/delete) — 1–2 uur werk, grote UX-verbetering.

De kritieke lekken (1–5) zijn **bewust uitgesteld** in de huidige sprint. Sprint 5 taak 5 (Firebase verify) is de geplande oplossing voor #1 en #2.

---

## 3. Inschatting Werk — Van POC naar "Goed"

### 3.1 Definitie "Goed"

- Echte authenticatie (Firebase verify)
- CORS beperkt
- Rate limiting basis
- Server-side validatie met duidelijke 400-responses
- Error handling bij alle mutaties
- Helmet of equivalente security headers
- Geen mock token in productie

### 3.2 Werkinschatting per Fase

| Fase | Taken | Geschatte tijd | Prioriteit |
|------|-------|----------------|------------|
| **A — Na GCP deploy (Sprint 6+)** | CORS beperken tot frontend URL | 0,5 u | P1 |
| | Error handling bij mutaties (try/catch + toast/feedback) | 1–2 u | P1 |
| | Helmet toevoegen | 0,5 u | P2 |
| **B — Firebase Auth (Sprint 5 taak 5)** | Firebase Admin SDK in backend | 2–3 u | P0 |
| | Token verify in authMiddleware | 1 u | P0 |
| | AUTH_MODE check: productie = Firebase, mock = dev only | 0,5 u | P0 |
| **C — Hardening** | Rate limiting (express-rate-limit) | 1 u | P2 |
| | Server-side validatie (Zod of handmatig) | 2–3 u | P2 |
| | UUID-validatie middleware | 0,5 u | P3 |
| | Globaal error handler | 1 u | P3 |
| **D — Tokenopslag (optioneel)** | HttpOnly cookie i.p.v. sessionStorage | 2–3 u | P3 |

### 3.3 Totaalinschatting

| Niveau | Inhoud | Tijd |
|--------|--------|------|
| **Minimum (POC → acceptabel)** | Fase A | 2–3 u |
| **Basis (productie-ready auth)** | Fase A + B | 5–7 u |
| **Goed (hardened)** | Fase A + B + C | 9–12 u |
| **Uitgebreid** | + Fase D | 12–15 u |

### 3.4 Aanbevolen Volgorde

1. **Nu (Sprint 6)**: Geen wijzigingen. Focus op GCP deploy.
2. **Direct na deploy**: Fase A (CORS + error handling + Helmet) — 2–3 u.
3. **Volgende sprint**: Fase B (Firebase verify) — 3–4 u. Dit is de grootste security-impact.
4. **Daarna**: Fase C naar behoefte.

---

## 4. Referenties

- [MOCK_LOGIN.md](./MOCK_LOGIN.md) — Productie: nooit AUTH_MODE=mock
- [FIREBASE_SECURE_SETUP.md](./FIREBASE_SECURE_SETUP.md) — Firebase configuratie
- [SECURITY_IMPLEMENTATION_PLAN.md](./SECURITY_IMPLEMENTATION_PLAN.md) — Security roadmap
- [SPRINT_6.md](../team/SPRINT_6.md) — GCP deploy planning
- [RETRO_2026-02.md](../team/RETRO_2026-02.md) — Geen extra features parallel

---

*@TheHammer — Security & QA Audit — 2026-02-28*
