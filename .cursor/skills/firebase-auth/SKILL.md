---
name: firebase-auth
description: 'Firebase Auth + Admin SDK patterns. Use when implementing login, token verify, or protected routes. Fase 6 — na eerste GCP deploy.'
---

# Firebase Auth Skill

## Wanneer te gebruiken
- Login flow implementeren (Sign in with Google)
- Token verificatie in backend (Firebase Admin SDK)
- Protected routes in frontend
- Session handling, token refresh

## Architectuur (Subscription Tracker)

```
[User] → signInWithPopup() → [Firebase] → id_token
   ↓
[Frontend] → Authorization: Bearer <token> → [API]
   ↓
[API] → admin.auth().verifyIdToken() → user_id → [Cloud SQL]
```

## Backend (Floyd)
- **Firebase Admin SDK**: `admin.auth().verifyIdToken(idToken)`
- **Geen** service account key in code — Cloud Run gebruikt Application Default Credentials
- Middleware: lees `Authorization` header, verify token, zet `req.userId`

## Frontend (Fede)
- **Env vars**: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `apiKey` is publiek — beveiliging via Authorized domains
- Session: HttpOnly cookie aanbevolen (niet sessionStorage voor tokens)

## Mock vs productie
- **Lokaal**: `AUTH_MODE=mock` — geen Firebase nodig
- **Productie**: Nooit mock — Firebase verify verplicht

## References
- [docs/FIREBASE_SECURE_SETUP.md](../../docs/FIREBASE_SECURE_SETUP.md)
- [docs/MOCK_LOGIN.md](../../docs/MOCK_LOGIN.md)
- [docs/SECURITY_IMPLEMENTATION_PLAN.md](../../docs/SECURITY_IMPLEMENTATION_PLAN.md)
