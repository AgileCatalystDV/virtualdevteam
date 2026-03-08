# Implementatievoorstel — Threat Model Quick Wins

**Auteurs**: Floyd (Backend), Fede (Frontend)  
**Datum**: 2026-03-08  
**Input**: [THREAT_MODEL_PRODUCTION_GCP.md](./THREAT_MODEL_PRODUCTION_GCP.md)  
**Principes**: KISS, security-by-default voor alle productie-achtige omgevingen

---

## 1. Uitgangspunten

| Principe | Toepassing |
|----------|------------|
| **KISS** | Geen overkill — minimale code, maximale impact |
| **Security-by-default** | Productie-veilig gedrag is de default; dev expliciet uitzonderen |
| **Fail fast** | Blokkeer onveilige config (bijv. mock in prod) bij opstart |
| **Geen breaking changes** | Bestaande flows blijven werken |

---

## 2. Quick Wins — Overzicht

| # | Threat | Actie | Verantwoordelijke | Geschat | Prioriteit |
|---|--------|-------|-------------------|---------|------------|
| 1 | T2, D2 | Body limit 50kb | Floyd | 2 min | P1 |
| 2 | I2 | Globaal error handler (geen stack traces) | Floyd | 15 min | P1 |
| 3 | S2 | AUTH_MODE=mock blokkeren in productie | Floyd | 10 min | P1 |
| 4 | D1 | Rate limiting (express-rate-limit) | Floyd | 15 min | P1 |
| 5 | — | Error handling bij mutaties (frontend) | Fede | 1 u | P1 |
| 6 | E4 | UUID-validatie voor :id param | Floyd | 10 min | P2 |

---

## 3. Implementatiedetails

### 3.1 Body limit 50kb (Floyd)

**Waarom**: T2, D2 — voorkom grote payloads, DoS via body.

**Hoe** — één regel wijziging in `index.js`:

```javascript
app.use(express.json({ limit: "50kb" }));
```

**Default**: Altijd aan (ook lokaal). KISS.

---

### 3.2 Globaal error handler (Floyd)

**Waarom**: I2 — geen stack traces of error details in API response.

**Hoe** — aan het einde van `index.js`, vóór `app.listen`:

```javascript
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});
```

**Default**: Productie = generic; dev = message (geen stack). Security-by-default.

---

### 3.3 AUTH_MODE=mock blokkeren in productie (Floyd)

**Waarom**: S2 — mock token in productie = iedereen kan impersoneren.

**Hoe** — in `auth.js` of bij opstart in `index.js`:

```javascript
if (process.env.NODE_ENV === "production" && process.env.AUTH_MODE === "mock") {
  console.error("FATAL: AUTH_MODE=mock is not allowed in production");
  process.exit(1);
}
```

**Default**: Productie + mock = crash. Fail fast.

**Alternatief (zachter)**: In authMiddleware: als prod + mock → 503 "Auth not configured". Geen crash, maar API weigert requests.

---

### 3.4 Rate limiting (Floyd)

**Waarom**: D1 — beperk abuse, massale requests.

**Hoe** — `express-rate-limit`:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per window
  message: { error: "Too many requests" },
  standardHeaders: true,
});
app.use("/v1/", limiter);
```

**Default**: 100/15min. Voldoende voor MVP; verhoog bij groei. KISS.

**Let op**: Plaats vóór routes, na CORS/Helmet.

---

### 3.5 Error handling bij mutaties (Fede)

**Waarom**: UX + Threat Model — gebruiker ziet niets bij netwerkfout.

**Hoe** — in `ApiDataProvider.tsx`:

```tsx
const addSubscription = useCallback(
  async (data: Omit<Subscription, "id" | "createdAt" | "updatedAt">) => {
    try {
      const created = await createSubscription(data, getToken());
      setSubscriptions((prev) => [...prev, created]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon niet toevoegen");
      throw err; // zodat form kan reageren
    }
  },
  []
);

const updateSub = useCallback(async (id: string, data: Partial<Subscription>) => {
  try {
    const updated = await updateSubscription(id, data, getToken());
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Kon niet bijwerken");
    throw err;
  }
}, []);

const removeSubscription = useCallback(async (id: string) => {
  try {
    await deleteSubscription(id, getToken());
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Kon niet verwijderen");
    throw err;
  }
}, []);
```

**Default**: Error in context; pagina's kunnen `error` tonen (toast of banner). KISS.

---

### 3.6 UUID-validatie (Floyd) — optioneel

**Waarom**: E4 — path traversal, ongeldige id → 400 i.p.v. 500.

**Hoe** — simpele regex of helper:

```javascript
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(id) {
  return typeof id === "string" && UUID_REGEX.test(id);
}
```

In routes: `if (!isValidUUID(req.params.id)) return res.status(400).json({ error: "Invalid id" });`

---

## 4. Volgorde implementatie

| Stap | Actie | Wie |
|------|-------|-----|
| 1 | Body limit | Floyd |
| 2 | Globaal error handler | Floyd |
| 3 | AUTH_MODE check (prod) | Floyd |
| 4 | Rate limiting | Floyd |
| 5 | Error handling ApiDataProvider | Fede |
| 6 | UUID validatie (optioneel) | Floyd |

**Totaal**: ~2–3 uur.

---

## 5. Wat we bewust niet doen (KISS)

| Item | Reden |
|------|-------|
| Zod/schema validatie | Handmatige checks voldoende voor nu; DB vangt rest |
| HttpOnly cookie | Sprint 7 P2; sessionStorage OK voor MVP |
| Dedicated DB user | Migratie + rollback complex; postgres OK voor MVP |
| Audit logging | Nice-to-have; niet blokkerend |
| Cloud Armor | GCP-kosten; express-rate-limit voldoende |

---

## 6. Environment detection — productie-achtig

**Definitie**: `NODE_ENV=production` of deployment op Cloud Run (Cloud Run zet NODE_ENV=production).

**Smart default**: Alles wat "production" gedrag heeft, is default. Dev is expliciet:
- `NODE_ENV=development` → meer details in errors, mock toegestaan
- `NODE_ENV=production` → generic errors, mock geblokkeerd

---

## 7. Referenties

- [THREAT_MODEL_PRODUCTION_GCP.md](./THREAT_MODEL_PRODUCTION_GCP.md)
- [SECURITY_DESIGN_PRODUCTION_GCP.md](./SECURITY_DESIGN_PRODUCTION_GCP.md)
- [SPRINT_7.md](../../team/SPRINT_7.md)

---

*Floyd, Fede — Implementatievoorstel Threat Model Quick Wins*
