# Security Architecture Review — SSO Integratie

**Reviewer**: PenPeter (Security Specialist)  
**Datum**: 2026-02-14  
**Scope**: Architectuur review + aanbevelingen voor eenvoudige 3rd party SSO (Google, Facebook, etc.)

---

## 📋 Architectuur Review — Huidige Staat

### ✅ Wat goed is
- **Cloud Run + Cloud SQL** — Duidelijke scheiding, serverless, schaalbaar
- **Secret Manager** — Credentials niet in code
- **HTTPS** — Encryptie in transit
- **Auth genoemd** — Firebase Auth / Identity Platform in overweging

### ⚠️ Ontbrekend voor SSO
- Geen expliciet **Identity Provider (IdP)** gekozen
- Geen **token flow** gedocumenteerd
- Geen **user model** in database (userId voor data isolatie)

---

## 🎯 Aanbeveling: **Firebase Authentication**

Gezien jullie **Google Cloud abonnement** is **Firebase Auth** de meest eenvoudige weg naar SSO.

### Waarom Firebase Auth

| Criterium | Firebase Auth |
|-----------|---------------|
| **Google Sign-In** | ✅ Native, 1-click setup |
| **Facebook Login** | ✅ Ingebouwd |
| **Apple, GitHub, etc.** | ✅ Ondersteund |
| **Integratie GCP** | ✅ Zelfde project, IAM |
| **Complexiteit** | Laag — SDK + config |
| **Kosten** | Gratis tot 50K MAU |

### Flow (vereenvoudigd)

```
[User] → Klik "Sign in with Google"
    → Redirect naar Google OAuth
    → User autoriseert
    → Firebase ontvangt id_token
    → Jouw backend verifieert token (Firebase Admin SDK)
    → Creëer/ophaal user in Cloud SQL
    → Return eigen JWT of session voor API-calls
```

---

## 🏗️ Aanbevolen Architectuur met SSO

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Google Cloud                                  │
│                                                                      │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐             │
│  │  Firebase   │    │  Cloud Run   │    │  Cloud SQL   │             │
│  │  Auth       │───▶│  (API)       │───▶│  PostgreSQL  │             │
│  │  (IdP)      │    │              │    │  + users     │             │
│  └─────────────┘    └──────────────┘    └──────────────┘             │
│         ▲                   ▲                                        │
│         │                   │                                        │
│  ┌──────┴──────┐     ┌──────┴──────┐                                 │
│  │  Google     │     │  Next.js    │                                 │
│  │  Facebook   │     │  Frontend   │                                 │
│  │  (OAuth)    │     │             │                                 │
│  └─────────────┘     └─────────────┘                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Componenten

| Component | Rol |
|-----------|-----|
| **Firebase Auth** | IdP — handelt Google/Facebook OAuth af, levert id_token |
| **Next.js Frontend** | `signInWithPopup()` of `signInWithRedirect()` — Firebase SDK |
| **Cloud Run API** | Verifieert Firebase id_token via Admin SDK, mint eigen JWT of session |
| **Cloud SQL** | `users` tabel: `id`, `firebase_uid`, `email`, `provider`, `created_at` |

---

## 🔒 Security Overwegingen (PenPeter)

### 1. Token Verificatie (Backend)
- **Nooit** vertrouw tokens van de client zonder verificatie
- Gebruik **Firebase Admin SDK** om id_token te verifiëren
- Check: `aud` (audience), `exp` (expiry), `iss` (issuer)

### 2. State Parameter (OAuth)
- Firebase SDK handelt dit af — **gebruik de SDK**, niet handmatige OAuth
- Voorkomt **CSRF** bij redirect flow

### 3. Redirect URIs
- Whitelist exacte URIs in Firebase Console en Google/Facebook Developer
- Geen wildcards — bijv. `https://jouwapp.com/auth/callback`

### 4. Token Opslag (Frontend)
- **Aanbeveling**: HttpOnly, Secure, SameSite cookies voor session
- Alternatief: Firebase managed session (automatisch)
- **Vermijd**: localStorage voor tokens (XSS-vatbaar)

### 5. Scope Minimalisatie
- Vraag alleen wat nodig is: `email`, `profile`
- Geen onnodige permissies (bijv. Google Drive)

### 6. Account Linking
- Zelfde email, verschillende providers (Google vs Facebook) — beslis: merge of aparte accounts?
- Firebase ondersteunt **account linking** — documenteer beleid

---

## 📐 Implementatiestappen (SSO)

### Stap 1: Firebase project
- Firebase project koppelen aan bestaand GCP project
- Authentication inschakelen
- **Sign-in method** activeren: Google, Facebook (en optioneel Apple, GitHub)

### Stap 2: Frontend
- `npm install firebase`
- Firebase config (apiKey, authDomain — in env vars, niet geheim maar wel beperkt)
- Login UI: "Sign in with Google", "Sign in with Facebook"
- Na login: `user.getIdToken()` → stuur naar backend

### Stap 3: Backend (Cloud Run API)
- Firebase Admin SDK: `admin.auth().verifyIdToken(idToken)`
- Bij eerste login: creëer user in Cloud SQL (`users` tabel)
- Return eigen JWT (met userId) of session cookie voor API-authorisatie

### Stap 4: Database
- `users` tabel: `id`, `firebase_uid`, `email`, `display_name`, `provider`, `created_at`
- `subscriptions` tabel: voeg `user_id` FK toe
- Alle queries filteren op `user_id`

---

## 🔄 Alternatief: **NextAuth.js**

Als je **geen** Firebase wilt:
- **NextAuth.js** — OAuth providers (Google, Facebook, etc.) via config
- Werkt met Next.js, session in JWT of database
- Meer controle, iets meer setup dan Firebase

**Trade-off**: NextAuth = meer flexibiliteit, Firebase = minder code, native GCP.

---

## 📊 Vergelijking SSO-Oplossingen

| Oplossing | Google | Facebook | Setup | GCP Fit |
|-----------|--------|----------|-------|---------|
| **Firebase Auth** | ✅ Native | ✅ | Eenvoudig | ⭐⭐⭐ |
| **NextAuth.js** | ✅ | ✅ | Medium | ⭐⭐ |
| **Identity Platform** | ✅ | ✅ | Medium | ⭐⭐⭐ (enterprise) |
| **Handmatig OAuth** | ✅ | ✅ | Complex | ⭐ (niet aanbevolen) |

---

## 🛡️ OWASP Relevante Punten

| OWASP | Maatregel |
|-------|-----------|
| **A07:2021 Auth Failures** | Gebruik Firebase/NextAuth — geen custom auth |
| **A01:2021 Broken Access Control** | `user_id` op elke subscription, server-side check |
| **A05:2021 Security Misconfiguration** | Redirect URIs whitelisten, CORS configureren |
| **A02:2021 Cryptographic Failures** | HTTPS, HttpOnly cookies, geen tokens in URL |

---

## ✅ Conclusie

**Aanbeveling PenPeter**: Gebruik **Firebase Authentication** voor SSO. Eenvoudig, veilig, native in GCP. Google en Facebook zijn één configuratie verwijderd. Laat de zware lifting (OAuth, token refresh, state) aan Firebase over — verminder je attack surface.

**Volgende stap**: @Alex — bevestig of Firebase Auth past in de architectuur. @Floyd — implementeer Firebase Auth flow zodra go.

---

## 📎 Follow-up

- **Alex**: [FIREBASE_SECURE_SETUP.md](./FIREBASE_SECURE_SETUP.md) — Validatie + secure setup guide
- **Floyd**: [MOCK_TO_GCP_MIGRATION.md](./MOCK_TO_GCP_MIGRATION.md) — Mock → GCP aansluiting + api-client

---

*PenPeter — Security Specialist — Architecture Review SSO*
