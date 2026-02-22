# Mock Login — Lokale dev zonder Firebase

**Auteurs**: Alex, Floyd, Fede  
**Datum**: 2026-02-22

---

## Overzicht

Met `NEXT_PUBLIC_AUTH_MODE=mock` (frontend) en `AUTH_MODE=mock` (api-backend) kun je de login flow lokaal testen zonder Firebase configuratie.

## Configuratie

| Omgeving | Variable | Waarde |
|----------|----------|--------|
| Frontend | `NEXT_PUBLIC_AUTH_MODE` | `mock` |
| api-backend | `AUTH_MODE` | `mock` |
| Frontend | `NEXT_PUBLIC_API_URL` | `http://localhost:8080/v1` |

## Flow

1. Start Docker + api-backend + frontend (zie [DEV_SETUP.md](./DEV_SETUP.md))
2. Ga naar `/login`
3. Klik **"Dev login (mock)"**
4. Token wordt gezet, redirect naar dashboard
5. API-calls gebruiken `Authorization: Bearer mock-dev-token`
6. Backend herkent token → `req.userId` = mock user UUID
7. Data wordt gefilterd op `user_id`

## Database schema

- **users**: `id`, `firebase_uid`, `email`, `display_name`, `provider`
- **subscriptions**: `user_id` FK naar users
- Mock user: `firebase_uid = 'mock-dev-user'`, `id = 11111111-1111-1111-1111-111111111111`

## Beperkingen

- **Next.js API** (`/api/v1`): Mock data is in-memory, geen user filtering. Gebruik api-backend voor volledige flow.
- **Productie**: Nooit `AUTH_MODE=mock` in productie — alleen voor lokale dev.
