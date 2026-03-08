# Security Audit Report — Subscription Tracker (Sprint 3)

**Auditor**: PenPeter (Security Specialist)  
**Datum**: 2026-02-14  
**Scope**: `subscription-tracker/` — MVP client-side applicatie

---

## 🚨 Executive Summary

| Metric | Resultaat |
|--------|-----------|
| **Critical Vulnerabilities** | 0 |
| **High Vulnerabilities** | 0 |
| **Medium Vulnerabilities** | 2 |
| **Low Vulnerabilities** | 2 |
| **Overall Risk Score** | 4.5/10 (Laag — acceptabel voor MVP) |

De applicatie is client-only met lokaal state (Zustand). Geen backend, geen auth, geen persistente opslag. Risicoprofiel is beperkt. De gevonden issues zijn voornamelijk **defensieve verbeteringen** voor wanneer backend/API wordt toegevoegd.

---

## 📊 Dependency Audit

| Project | Vulnerabilities |
|---------|-----------------|
| subscription-tracker | **0** |
| crud-app | *(zie npm audit output)* |

**Aanbeveling**: Voer `npm audit` regelmatig uit. Overweeg Dependabot of Snyk voor automatische alerts.

---

## 🔍 Detailed Findings

### Medium — Input Validatie

#### 1. Geen max length op `name` en `notes`
- **Location**: `SubscriptionForm.tsx`
- **Description**: Velden `name` en `notes` hebben geen maximale lengte. Een gebruiker kan extreem lange strings invoeren (bijv. 1MB).
- **Impact**: Bij toekomstige backend: DoS, database overflow, performance issues.
- **Remediation**: Voeg toe: `name` max 100 chars, `notes` max 500 chars. HTML5 `maxLength` + client-side check.
- **OWASP**: A03:2021 — Injection (indirect, via data overflow)

#### 2. Geen max op `price`
- **Location**: `SubscriptionForm.tsx` (Input type="number")
- **Description**: Prijs heeft geen bovengrens. `999999999` is technisch mogelijk.
- **Impact**: Dashboard totalen kunnen overflow/NaN geven. Bij backend: onrealistische data.
- **Remediation**: Voeg toe: `max="999999.99"` of vergelijkbaar. Optioneel: server-side validatie later.

---

### Low — Defensieve Verbeteringen

#### 3. `nextBillingDate` format niet gevalideerd
- **Location**: `SubscriptionForm.tsx`
- **Description**: `type="date"` geeft ISO string, maar bij programmatische wijziging of toekomstige API kan ongeldig formaat binnenkomen.
- **Impact**: Laag — browser date input is restrictief. Alleen relevant bij API-integratie.
- **Remediation**: Bij backend: valideer met `Date.parse()` of library (date-fns, dayjs).

#### 4. `categoryId` — geen validatie tegen bestaande categories
- **Location**: `store.ts` — `addSubscription`, `updateSubscription`
- **Description**: Store accepteert elke `categoryId`. Als een category later verwijderd wordt, kunnen orphaned references ontstaan.
- **Impact**: Laag — nu geen category delete. Bij uitbreiding: validatie toevoegen.
- **Remediation**: Bij category CRUD: check `categories.some(c => c.id === categoryId)` voor add/update.

---

## ✅ Wat goed gaat

| Aspect | Status | Notes |
|--------|--------|-------|
| **XSS** | ✅ Passed | Geen `dangerouslySetInnerHTML`, geen `eval`. React escaped alle output. |
| **Injection** | ✅ Passed | Geen SQL, geen shell. Client-only. |
| **Auth** | N.v.t. | Geen auth in MVP. Bij Fase 2: JWT/session. |
| **Sensitive data** | ✅ Passed | Geen payment details, geen credentials. |
| **Dependencies** | ✅ Passed | 0 vulnerabilities in subscription-tracker. |

---

## 🛡️ Action Plan

| Prioriteit | Actie | Status |
|------------|-------|--------|
| **P1** | Max length op name (100) en notes (500) | ✅ Geïmplementeerd |
| **P1** | Max price (999999.99) op input | ✅ Geïmplementeerd |
| **P2** | Bij backend: server-side validatie op alle inputs | ⏳ Fase 2 |
| **P2** | Bij category delete: validatie categoryId | ⏳ Fase 2 |

---

## 📋 Compliance Matrix (MVP scope)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Input Validation | ⚠️ Partial | Price, category OK. Name/notes lack max length. |
| XSS Prevention | ✅ Passed | React default escaping |
| Dependency Security | ✅ Passed | npm audit clean |
| Secure Data Storage | N.v.t. | Client-only, no persistence |
| Authentication | N.v.t. | Fase 2 |

---

*PenPeter — Security Specialist — Sprint 3 Audit*
