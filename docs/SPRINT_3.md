# Sprint 3 — Security Review & Backend Voorbereiding

**Co-PM Intelligence** — Aansturing  
**Status**: ✅ Afgerond  
**Gepland**: Na Sprint 2

---

## 🎯 Sprint Doel
Security hardening van de Subscription Tracker en voorbereiding op backend-integratie. Focus op wat nu relevant is (MVP scope) en wat de weg vrijmaakt voor Fase 2.

---

## 📋 Taken & Verantwoordelijken

### ✅ P0 — Afgerond
| # | Taak | Status |
|---|------|--------|
| 1 | Security audit | ✅ [SECURITY_AUDIT_SPRINT3.md](./SECURITY_AUDIT_SPRINT3.md) |
| 2 | Dependency audit | ✅ 0 vulnerabilities (subscription-tracker, crud-app) |
| 3 | Security rapport | ✅ |

### ✅ P1 — Afgerond
| # | Taak | Status |
|---|------|--------|
| 4 | Adresseren security findings | ✅ Max length, max price in SubscriptionForm |
| 5 | API contract documenteren | ✅ [API_CONTRACT.md](./API_CONTRACT.md) |

### P2 — Optioneel (indien tijd)
| # | Taak | Verantwoordelijke | Beschrijving |
|---|------|-------------------|--------------|
| 6 | **Backend API scaffold** | @Floyd | Express/FastAPI basis, endpoints stubs |
| 7 | **Export CSV** | @Fede | Export-knop voor abonnementen naar CSV |

---

## 📢 Co-PM Directieven

**@PenPeter** — Voer security review uit op `subscription-tracker/`. Focus op:
- **Input validatie**: name, price, notes, nextBillingDate — max length, sanitization
- **XSS**: React escaping OK? Notes/name in UI — geen `dangerouslySetInnerHTML`?
- **OWASP Top 10**: Relevante punten voor client-only app (A03 Injection, A07 Auth, etc.)
- **Dependencies**: `npm audit` in subscription-tracker en crud-app
- **Output**: `docs/SECURITY_AUDIT_SPRINT3.md` volgens security-audit skill template

**@Alex** — Documenteer API contract voor toekomstige backend. Zie specs: `GET/POST/PUT/DELETE /api/subscriptions` en `/api/categories`. OpenAPI 3.0 of simpele markdown-tabel volstaat.

**@Fede** — Na ontvangst security rapport: adresseer P0/P1 findings. Beschikbaar voor Export CSV indien gewenst.

**@Floyd** — Optioneel: scaffold backend (Express of FastAPI) met stubs voor de endpoints. Geen DB nodig in deze sprint — mock responses volstaan.

---

## 📁 Referentie

- **Specs**: [SUBSCRIPTION_TRACKER_SPECS.md](./SUBSCRIPTION_TRACKER_SPECS.md)
- **Security skill**: `.cursor/skills/security-audit/SKILL.md`
- **Architectuur**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## ⏳ Volgende sprint (Sprint 4)

- Backend API implementatie (PostgreSQL, echte CRUD)
- Authenticatie (indien go van Lead PM)
- Herinneringen / notificaties (Fase 2)

---

*Co-PM Intelligence — Sprint 3 voorbereiding*
