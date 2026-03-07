# QA Review — Frontend Testing

**Reviewer**: Maya (QA Engineer)  
**Datum**: 2026-02-15  
**Scope**: subscription-tracker frontend — test coverage en aanbevelingen

---

## Samenvatting

**Huidige staat**: Geen geautomatiseerde tests. Geen Jest, React Testing Library of Cypress in package.json.

**Aanbeveling**: Start met unit tests voor kritieke logica (form validatie, api-client). E2E later, zodra GCP/productie stabiel is.

---

## Huidige coverage

| Component / Module | Tests | Risico zonder tests |
|--------------------|-------|---------------------|
| **SubscriptionForm** | 0 | Validatie (name, price, category, notes) — regressie bij wijzigingen |
| **api-client** | 0 | Fetch, error handling — contract compliance |
| **ApiDataProvider** | 0 | Data flow, refetch, CRUD — integratie met API |
| **Login** | 0 | Auth flow, error states — security-gerelateerd |
| **SubscriptionList, Card, DashboardSummary** | 0 | Presentatie — lager risico |
| **UI components (Button, Input, Card)** | 0 | Herbruikbaar — lager risico |

---

## Wat ik wil bereiken (prioriteit)

### P0 — Kritieke logica (unit tests)

| # | Target | Reden |
|---|--------|-------|
| 1 | **SubscriptionForm** | Validatie: lege naam, negatieve prijs, max 100 chars, max 500 notes. Regressie bij wijzigingen. |
| 2 | **api-client** | Mock fetch; test dat 4xx/5xx correct als Error wordt gegooid; test dat response wordt geparsed. |

### P1 — Data layer

| # | Target | Reden |
|---|--------|-------|
| 3 | **ApiDataProvider** | Mock api-client; test loading/error states; test dat refetch wordt aangeroepen. |
| 4 | **useApiData** | Test dat error wordt gegooid buiten provider. |

### P2 — E2E (later)

| # | Target | Reden |
|---|--------|-------|
| 5 | **Happy path** | Dashboard → nieuw abonnement → lijst toont item. Vereist Playwright of Cypress. |
| 6 | **Login flow** | Sign in → redirect. Vereist Firebase mock of test mode. |

---

## Voorgestelde setup

### Stap 1: Jest + React Testing Library

```bash
cd subscription-tracker
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Config**: Next.js 16 heeft `next/jest` — of gebruik Vitest (sneller, modern).

### Stap 2: Eerste tests

**SubscriptionForm** (voorbeeld):
```typescript
// components/subscriptions/SubscriptionForm.test.tsx
describe('SubscriptionForm', () => {
  it('toont fout bij lege naam', async () => {
    const onSubmit = jest.fn();
    render(<SubscriptionForm categories={mockCategories} onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /opslaan/i }));
    expect(screen.getByText(/naam is verplicht/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it('submittet bij geldige data', async () => {
    // ...
  });
});
```

**api-client** (met mock fetch):
```typescript
// lib/api-client.test.ts
describe('fetchCategories', () => {
  it('gooit Error bij 404', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchCategories()).rejects.toThrow();
  });
});
```

### Stap 3: npm script

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

---

## Wat ik níet prioriteer (nu)

| Item | Reden |
|------|-------|
| **E2E tests** | Vereist draaiende API + DB; beter na GCP-stabilisatie |
| **Visual regression** | Percy/Chromatic — overkill voor MVP |
| **100% coverage** | SubscriptionCard, DashboardSummary — presentationale componenten; minder ROI |
| **Firebase Auth tests** | Complex te mocken; handmatige test voldoende voor nu |

---

## Conclusie

**Voldoende testing?** Nee — er is momenteel geen geautomatiseerde frontend testing.

**Wat wil ik bereiken?**
1. **P0**: SubscriptionForm + api-client unit tests — hoogste ROI, beschermt tegen regressie
2. **P1**: ApiDataProvider tests — data flow
3. **P2**: E2E — later, na productie

**Aanbevolen volgende stap**: @Fede — voeg Jest/Vitest + RTL toe; start met SubscriptionForm.test.tsx. Ik (Maya) kan de test cases verder uitwerken.

---

*Maya — QA Engineer — Frontend Testing Review*
