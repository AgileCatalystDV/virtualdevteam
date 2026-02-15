# Firebase Auth — Secure Setup in Google Cloud

**Auteur**: Architect Alex  
**Datum**: 2026-02-14  
**Context**: Validatie van PenPeter's security recommendations + secure setup guide

---

## ✅ Validatie Security Recommendations (PenPeter)

Alex heeft PenPeter's aanbevelingen nagekeken. **Alle punten zijn correct en worden onderschreven.**

| Aanbeveling PenPeter | Alex Validatie |
|----------------------|----------------|
| Token verificatie via Admin SDK | ✅ Correct — nooit client-tokens vertrouwen |
| State parameter (CSRF) | ✅ Firebase SDK handelt af |
| Redirect URIs whitelisten | ✅ Vereist in Firebase + Google/Facebook console |
| HttpOnly cookies i.p.v. localStorage | ✅ Aanbevolen voor session |
| Scope minimalisatie | ✅ Alleen email, profile |
| Account linking beleid | ✅ Documenteer voor support |

**Conclusie Alex**: PenPeter's security model is solide. Geen aanvullingen nodig.

---

## 🔒 Secure Firebase Setup — Stap voor Stap

### Stap 1: Firebase project koppelen aan GCP

1. Ga naar [Firebase Console](https://console.firebase.google.com)
2. **Add project** of selecteer bestaand project
3. **Koppel aan bestaand GCP project** — gebruik hetzelfde project als Cloud Run/Cloud SQL
4. **Regio**: Kies `europe-west1` (België) voor GDPR

### Stap 2: Authentication inschakelen

1. Firebase Console → Build → Authentication
2. **Get started** → Sign-in method
3. **Google** — Enable (native, geen extra config)
4. **Facebook** — Enable, voeg App ID + App Secret toe (uit [Facebook Developers](https://developers.facebook.com))
5. **Authorized domains** — Alleen jouw domeinen: `jouwapp.com`, `jouwapp.web.app` (geen localhost in productie)

### Stap 3: Secure configuratie

| Instelling | Waarde | Reden |
|------------|--------|-------|
| **Authorized domains** | Exact whitelist | Geen wildcards |
| **Email enumeration** | Disable (optioneel) | Minder info-leak bij "user not found" |
| **Multi-factor auth** | Enable (Fase 2) | Extra beveiliging voor gevoelige accounts |
| **Session persistence** | Local (default) of None | Firebase managed |

### Stap 4: Service Account (Backend)

- Firebase project heeft automatisch een **service account**
- Ga naar GCP Console → IAM → Service accounts
- Firebase Admin SDK gebruikt **Application Default Credentials** op Cloud Run
- **Geen** service account key in code — Cloud Run injecteert credentials automatisch

### Stap 5: Frontend config (niet geheim, wel beperkt)

```env
# .env.local — NIET committen, wel nodig voor build
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
```

- `apiKey` is **publiek** — dat is by design. Beveiliging zit in **Authorized domains** + **Firebase Security Rules**
- Beperk Authorized domains strikt
- Gebruik **App Check** (optioneel) om API-abuse te beperken

### Stap 6: App Check (aanbevolen)

- Firebase App Check — verifieert dat requests van jouw app komen
- Beschermt tegen abuse (bijv. API zonder legitieme app)
- Setup: reCAPTCHA v3 of Play Integrity (Android)

---

## 📐 Architectuur — Waar past Firebase?

```
GCP Project (één project)
├── Firebase (Authentication)
│   └── Handelt OAuth af, levert id_tokens
├── Cloud Run (API)
│   └── Verifieert tokens, praat met Cloud SQL
├── Cloud SQL (PostgreSQL)
│   └── users, subscriptions, categories
└── Secret Manager
    └── DB URL, JWT signing key (eigen tokens)
```

**Firebase en Cloud SQL zijn complementair**: Firebase = identity, Cloud SQL = jouw data. Geen conflict.

---

## 🛡️ Checklist Secure Setup

| # | Actie | Status |
|---|-------|--------|
| 1 | Firebase project = zelfde GCP project | |
| 2 | Authorized domains = exacte whitelist | |
| 3 | Geen service account key in repo | |
| 4 | Admin SDK op Cloud Run via ADC | |
| 5 | HttpOnly cookies voor session (backend) | |
| 6 | App Check inschakelen (optioneel) | |
| 7 | Regio europe-west1 | |

---

## ✅ Conclusie Alex

Firebase Auth kan **eenvoudig en veilig** worden opgezet in Google Cloud. PenPeter's recommendations zijn valide. Volg de stappen hierboven voor een secure setup. De combinatie Firebase (identity) + Cloud SQL (data) + Secret Manager (credentials) is een bewezen patroon.

---

*Alex — Architect — Firebase Secure Setup Validatie*
