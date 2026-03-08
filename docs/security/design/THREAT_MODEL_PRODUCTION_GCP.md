# Threat Model — Productie GCP Setup

**Auteurs**: PenPeter (Security), Ian (DevSecOps)  
**Datum**: 2026-03-08  
**Scope**: Subscription Tracker — Cloud Run + Cloud SQL + Secret Manager  
**Methode**: STRIDE  
**Input**: [SECURITY_DESIGN_PRODUCTION_GCP.md](./SECURITY_DESIGN_PRODUCTION_GCP.md)

---

## 1. Data Flow Diagram

```
[Gebruiker] ──HTTPS──▶ [Cloud Run Frontend] ──REST + Bearer──▶ [Cloud Run API]
                                                                      │
                                                                      ├──▶ [Secret Manager] (db-url)
                                                                      │
                                                                      └──▶ [Cloud SQL] (Unix socket)
```

### Actors
- **Gebruiker**: Legitieme of kwaadwillende eindgebruiker
- **Cloud Run Frontend**: Vertrouwd (onze code)
- **Cloud Run API**: Vertrouwd (onze code)
- **Cloud SQL**: Vertrouwd (GCP managed)
- **Secret Manager**: Vertrouwd (GCP managed)

### Assets
- User subscriptions (naam, prijs, categorie — PII-achtig)
- Auth tokens (Firebase id_token)
- Database credentials (in Secret Manager)

---

## 2. STRIDE Analyse

### S — Spoofing (Identiteitsdiefstal)

| # | Bedreiging | Component | Risico | Mitigatie |
|---|------------|-----------|--------|-----------|
| S1 | Aanvaller stuurt valse Bearer token | API | Hoog | Firebase Admin SDK verifyIdToken (Sprint 7) |
| S2 | Mock token in productie | API auth.js | Hoog | AUTH_MODE ≠ mock in productie; documenteer |
| S3 | CORS bypass — andere origin doet request | API | Medium | CORS whitelist (✅ geïmplementeerd) |
| S4 | Database credentials gestolen | Secret Manager | Laag | IAM least privilege; geen public IP op Cloud SQL |

### T — Tampering (Data manipulatie)

| # | Bedreiging | Component | Risico | Mitigatie |
|---|------------|-----------|--------|-----------|
| T1 | SQL injection | API → Cloud SQL | Medium | Parameterized queries (pg) — ✅ |
| T2 | Malicious JSON body (oversized, malformed) | API | Laag | Body limit 50kb; input validatie |
| T3 | Subscription data wijzigen van andere user | API | Hoog | user_id filter in queries; Firebase verify |
| T4 | Man-in-the-middle (HTTPS downgrade) | Transport | Laag | HTTPS enforced door Cloud Run |

### R — Repudiation (Ontkenning)

| # | Bedreiging | Component | Risico | Mitigatie |
|---|------------|-----------|--------|-----------|
| R1 | Gebruiker ontkent actie (add/update/delete) | API | Medium | user_id in DB; audit log optioneel |
| R2 | Geen logging van mutaties | API | Laag | Cloud Logging; overweeg structured logs |
| R3 | Admin-acties niet traceerbaar | — | Laag | MVP: geen admin; later IAM audit logs |

### I — Information Disclosure (Data lekken)

| # | Bedreiging | Component | Risico | Mitigatie |
|---|------------|-----------|--------|-----------|
| I1 | Token in sessionStorage — XSS exfiltratie | Frontend | Medium | HttpOnly cookie (Sprint 7 optie) |
| I2 | Stack trace / error details in response | API | Medium | Globaal error handler; generic 500 |
| I3 | DATABASE_URL in logs | API | Hoog | Nooit loggen; Secret Manager injectie |
| I4 | Subscriptions van user A zichtbaar voor user B | API | Hoog | user_id filter; Firebase verify |
| I5 | Categories publiek | API | Laag | Bewust — referentiedata, geen PII |

### D — Denial of Service

| # | Bedreiging | Component | Risico | Mitigatie |
|---|------------|-----------|--------|-----------|
| D1 | Massale requests — Cloud Run schaalt | API | Medium | max-instances=1 (✅ Bill Shock) |
| D2 | Grote request bodies | API | Laag | Body limit 50kb |
| D3 | Database connection exhaustion | API | Laag | Connection pool (pg.Pool) |
| D4 | Cloud SQL overload | Cloud SQL | Laag | db-g1-small; beperkte connections |

### E — Elevation of Privilege

| # | Bedreiging | Component | Risico | Mitigatie |
|---|------------|-----------|--------|-----------|
| E1 | postgres superuser voor app | Cloud SQL | Medium | Dedicated user met least privilege |
| E2 | Cloud Run SA met te veel rechten | GCP IAM | Medium | Alleen Secret Accessor + Cloud SQL Client |
| E3 | Bypass auth via directe API-call | API | Hoog | Firebase verify op alle /v1/subscriptions |
| E4 | Path traversal in id param | API | Laag | UUID validatie; parameterized queries |

---

## 3. Prioritering — Actieplan

### P0 — Voor productie (Sprint 7)
- **S1, S2, E3**: Firebase token verify; AUTH_MODE check
- **I4**: user_id filter in alle subscription-queries
- **T3**: Idem; ownership check bij update/delete

### P1 — Kort na productie
- **E1**: Dedicated DB user (subscription_tracker_app)
- **I2**: Globaal error handler (geen stack traces)
- **T2**: Body limit + input validatie
- **D1**: Rate limiting (express-rate-limit)

### P2 — Hardening
- **I1**: HttpOnly cookie i.p.v. sessionStorage
- **R1**: Audit log voor mutaties
- **E2**: Dedicated Cloud Run service account

---

## 4. Risicomatrix (samenvatting)

| STRIDE | Hoog | Medium | Laag |
|--------|------|--------|------|
| **S** | S1, S2 | S3 | S4 |
| **T** | T3 | T1 | T2, T4 |
| **R** | — | R1 | R2, R3 |
| **I** | I3, I4 | I1, I2 | I5 |
| **D** | — | D1 | D2, D3, D4 |
| **E** | E3 | E1, E2 | E4 |

---

## 5. Implementatie

**Implementatievoorstel**: [IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md](./IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md) — Floyd + Fede: quick wins, KISS, security-by-default.

---

## 6. Referenties

- [SECURITY_DESIGN_PRODUCTION_GCP.md](./SECURITY_DESIGN_PRODUCTION_GCP.md)
- [SECURITY_AUDIT_THEHAMMER_2026-02.md](../audits/SECURITY_AUDIT_THEHAMMER_2026-02.md)
- [threat-modeling SKILL](../../../.cursor/skills/threat-modeling/SKILL.md)

---

*PenPeter, Ian — Threat Model Productie GCP*
