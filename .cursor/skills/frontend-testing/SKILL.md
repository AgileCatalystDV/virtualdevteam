---
name: frontend-testing
description: 'Maya (QA): Vitest + React Testing Library best practices. Use when writing or reviewing frontend tests.'
---

# Frontend Testing Skill

## Wanneer te gebruiken
- Nieuwe component tests schrijven
- Bestaande tests reviewen of fixen
- Test setup configureren

## Stack
- **Vitest** — Sneller dan Jest, ESM-native, HMR
- **React Testing Library** — User-centric queries
- **@testing-library/jest-dom** — `toBeInTheDocument()`, `toBeDisabled()`, etc.
- **@testing-library/user-event** — Realistische user interactions (voorkeur boven fireEvent)

## Best Practices (2025)

### 1. Test zoals de gebruiker
- Gebruik `getByRole`, `getByLabelText`, `getByPlaceholderText`
- Vermijd `getByTestId` tenzij nodig
- `userEvent` i.p.v. `fireEvent` voor realistische flows

### 2. Form tests
- `fireEvent.submit(form)` i.p.v. button click — omzeilt native HTML5 validatie
- `container.querySelector("form")` — form heeft geen role="form"
- `waitFor()` voor async state updates na submit

### 3. Number inputs
- `fireEvent.change(input, { target: { value: "-5" } })` — userEvent.type werkt slecht op type="number"

### 4. Setup
- `vitest.setup.ts`: `import "@testing-library/jest-dom"`
- Path alias `@` in vitest.config voor imports

## References
- [Vitest](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
