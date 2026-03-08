# Sprint 7 — Auth + Security Quick Wins

**Co-PM Intelligence** — Aansturing  
**Status**: Gepland  
**Focus**: Firebase Auth (bonus Sprint 6) + security hardening zonder extra kosten

---

## 🎯 Sprint Doel

1. **Auth**: Firebase token verify in backend — echte login, user-scoped data
2. **Security**: Quick wins uit [SECURITY_AUDIT_THEHAMMER_2026-02.md](../security/audits/SECURITY_AUDIT_THEHAMMER_2026-02.md) — geen extra GCP-kosten

---

## 📋 Taken — Voorstel

### P0 — Auth (was Sprint 6 bonus)

| # | Taak | Verantwoordelijke | Ref |
|---|------|-------------------|-----|
| 1 | Firebase Admin SDK in backend | @Floyd | Sprint 5 taak 5 |
| 2 | Token verify in authMiddleware | @Floyd | FIREBASE_SECURE_SETUP.md |
| 3 | AUTH_MODE: productie = Firebase, mock = dev only | @Floyd | MOCK_LOGIN.md |

### P1 — Security Quick Wins (geen extra kosten)

| # | Taak | Verantwoordelijke | Geschat | Status |
|---|------|-------------------|---------|--------|
| 4 | CORS beperken tot frontend Cloud Run URL + localhost | @Floyd | 5 min | ✅ |
| 5 | Helmet toevoegen (security headers) | @Floyd | 15 min | ✅ |
| 6 | Body size limit `express.json({ limit: "50kb" })` | @Floyd | 2 min | ✅ |
| 7 | Globaal error handler (geen stack traces in prod) | @Floyd | 15 min | ✅ |
| 8 | Error handling bij mutaties (try/catch + feedback) | @Fede | 1–2 u | Future |

### P2 — Optioneel (future)

| # | Taak | Verantwoordelijke |
|---|------|-------------------|
| 9 | Rate limiting (express-rate-limit) | @Floyd |
| 10 | Server-side validatie (Zod) | @Floyd |

---

## 📁 Referenties

- [IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md](../security/design/IMPLEMENTATION_PROPOSAL_THREAT_MODEL.md) — Floyd + Fede: quick wins, KISS, security-by-default
- [SECURITY_AUDIT_THEHAMMER_2026-02.md](../security/audits/SECURITY_AUDIT_THEHAMMER_2026-02.md) — Fase A/B volgorde
- [FIREBASE_SECURE_SETUP.md](../security/FIREBASE_SECURE_SETUP.md) — Firebase config
- [MOCK_LOGIN.md](../security/MOCK_LOGIN.md) — Productie: nooit AUTH_MODE=mock
- [DEPLOYMENT_GCP_MVP.md](../setup/DEPLOYMENT_GCP_MVP.md) — Frontend URL voor CORS

---

## 📢 Directieven

**@Lead PM** — Prioriteer P0 (auth) of P1 (quick wins) naar behoefte. Beide zijn waardevol.

**@Floyd** — Firebase Admin SDK + CORS + Helmet. Zie SECURITY_AUDIT sectie 3.2.

**@Fede** — Error handling in ApiDataProvider (add/update/delete) — toast of inline feedback bij fout.

---

*Co-PM Intelligence — Sprint 7 — Auth + Security*
