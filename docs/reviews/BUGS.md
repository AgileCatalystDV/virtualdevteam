# Bug Register — Subscription Tracker

**Beheer**: Maya (QA Engineer)  
**Laatste update**: 2026-02-14

---

## Actieve bugs

### BUG-001 — Mock API: POST voegt niet toe aan GET-lijst
| Veld | Waarde |
|------|--------|
| **Severity** | High |
| **Component** | `app/api/v1/subscriptions/route.ts` |
| **Status** | ✅ Fixed |
| **Gevonden** | 2026-02-14 |

**Beschrijving**: POST `/api/v1/subscriptions` retourneert het nieuwe abonnement (201) maar voegt het niet toe aan de in-memory array. GET `/api/v1/subscriptions` toont het nieuwe item nooit.

**Stappen om te reproduceren**:
1. `curl -X POST http://localhost:3000/api/v1/subscriptions -H "Content-Type: application/json" -d '{"name":"Test","price":10,"currency":"EUR","billingCycle":"monthly","categoryId":"cat-streaming"}'`
2. `curl http://localhost:3000/api/v1/subscriptions`
3. Het nieuwe abonnement ontbreekt in de lijst.

**Verwacht**: POST zou het item moeten toevoegen aan de mock-datastore zodat GET het teruggeeft.

---

### BUG-002 — Mock API: PUT wijzigt niet persistent
| Veld | Waarde |
|------|--------|
| **Severity** | High |
| **Component** | `app/api/v1/subscriptions/[id]/route.ts` |
| **Status** | ✅ Fixed |
| **Gevonden** | 2026-02-14 |

**Beschrijving**: PUT retourneert het geüpdatete object maar schrijft het niet terug naar `MOCK_SUBSCRIPTIONS`. Volgende GET retourneert de oude data.

**Stappen om te reproduceren**:
1. `curl -X PUT http://localhost:3000/api/v1/subscriptions/sub-1 -H "Content-Type: application/json" -d '{"name":"Netflix Updated"}'`
2. `curl http://localhost:3000/api/v1/subscriptions/sub-1`
3. Na server-restart of nieuwe request: oude naam kan terugkomen (afhankelijk van module cache).

---

### BUG-003 — Mock API: DELETE verwijdert niet persistent
| Veld | Waarde |
|------|--------|
| **Severity** | High |
| **Component** | `app/api/v1/subscriptions/[id]/route.ts` |
| **Status** | ✅ Fixed |
| **Gevonden** | 2026-02-14 |

**Beschrijving**: DELETE retourneert 200 maar verwijdert het item niet uit `MOCK_SUBSCRIPTIONS`. GET na DELETE toont het item nog steeds.

**Stappen om te reproduceren**:
1. `curl -X DELETE http://localhost:3000/api/v1/subscriptions/sub-1`
2. `curl http://localhost:3000/api/v1/subscriptions/sub-1`
3. Item bestaat nog (retourneert 200 met data).

---

### BUG-004 — Mock API: Gescheiden datastores list vs detail
| Veld | Waarde |
|------|--------|
| **Severity** | Medium |
| **Component** | `route.ts` vs `[id]/route.ts` |
| **Status** | ✅ Fixed |
| **Gevonden** | 2026-02-14 |

**Beschrijving**: `route.ts` gebruikt een array, `[id]/route.ts` gebruikt een Record. Twee aparte datastores — wijzigingen in de ene zijn niet zichtbaar in de andere. Bij API-integratie moet één gedeelde mock-datastore gebruikt worden.

---

## Opgelost

| Bug | Opgelost door | Datum |
|-----|---------------|-------|
| BUG-001 t/m BUG-004 | @Fede | 2026-02-14 |

**Oplossing**: Gedeelde mock-datastore in `lib/mock-subscriptions.ts`. Beide route-bestanden importeren deze module; POST voegt toe, PUT wijzigt, DELETE verwijdert — alle wijzigingen zijn persistent (tot server-restart).

---

## Template voor nieuwe bugs

```markdown
### BUG-XXX — [Korte titel]
| Veld | Waarde |
|------|--------|
| **Severity** | Low / Medium / High / Critical |
| **Component** | [bestand of module] |
| **Status** | Open / In progress / Fixed |
| **Gevonden** | YYYY-MM-DD |

**Beschrijving**: [Wat gaat er mis?]

**Stappen om te reproduceren**:
1. ...
2. ...

**Verwacht**: [Wat zou moeten gebeuren?]
```

---

*Maya — QA Engineer — Bug Register*
