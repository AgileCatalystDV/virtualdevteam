# Security Implementation Plan — Later Sprint

**Auteur**: PenPeter (Security Specialist)  
**Datum**: 2026-02-15  
**Bron**: [Security Code Review Frontend](../../subscription-tracker)  
**Status**: Backlog — uit te voeren in latere sprint

---

## Overzicht

Implementatieplan voor de security-bevindingen uit de frontend code review. Items zijn prioriteitsgeordend en geschat in story points (SP).

| # | Item | Prioriteit | SP | Afhankelijk van |
|---|------|------------|-----|-----------------|
| 1 | HttpOnly cookies i.p.v. sessionStorage | HIGH | 5 | Backend auth endpoint |
| 2 | Route protection (middleware) | HIGH | 3 | - |
| 3 | API token validatie | HIGH | 5 | Firebase Admin SDK |
| 4 | Security headers (next.config) | MEDIUM | 1 | - |
| 5 | Hardening foutmeldingen | MEDIUM | 2 | - |
| 6 | Token refresh logica | LOW | 3 | - |

---

## 1. HttpOnly cookies i.p.v. sessionStorage

**Probleem**: JWT in `sessionStorage` is leesbaar door elk script; XSS = token theft.

**Oplossing**:
- Backend endpoint (bijv. `/api/auth/session`) die na Firebase token verificatie een HttpOnly, Secure, SameSite cookie zet
- Frontend: geen `sessionStorage.setItem("auth_token", ...)` meer; cookie wordt automatisch meegestuurd
- API client: `credentials: "include"` bij fetch; geen handmatige Authorization header voor session cookie

**Taken**:
- [ ] Backend: `/api/auth/session` POST endpoint (accepteert Firebase ID token, verifieert, zet cookie)
- [ ] Backend: cookie config (httpOnly, secure, sameSite, path, maxAge)
- [ ] Frontend: login flow aanpassen — na Firebase sign-in, token naar `/api/auth/session` sturen
- [ ] Frontend: `ApiDataProvider` en `api-client` aanpassen — cookie-based i.p.v. Bearer token
- [ ] Verwijderen: `sessionStorage.getItem/setItem("auth_token")`

**Referentie**: [FIREBASE_SECURE_SETUP.md](./FIREBASE_SECURE_SETUP.md)

---

## 2. Route protection (Next.js middleware)

**Probleem**: Alle routes zijn publiek; ongeauthenticeerde gebruikers kunnen alles zien.

**Oplossing**: Next.js `middleware.ts` die beschermde routes controleert en redirect naar `/login`.

**Taken**:
- [ ] `subscription-tracker/middleware.ts` aanmaken
- [ ] Beschermde routes: `/`, `/subscriptions`, `/subscriptions/new`, `/subscriptions/[id]/edit`
- [ ] Publieke routes: `/login`, `/api/auth/*`, statische assets
- [ ] Logica: cookie aanwezig? → doorlaten; anders → redirect naar `/login`
- [ ] Edge runtime compatibel houden (geen Node-specifieke APIs)

**Voorbeeld structuur**:
```ts
// middleware.ts
const protectedPaths = ["/", "/subscriptions"];
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has("session"); // of jouw cookie naam
  if (protectedPaths.some(p => request.nextUrl.pathname.startsWith(p)) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
```

---

## 3. API token validatie

**Probleem**: API routes valideren geen Authorization header; iedereen kan data ophalen/wijzigen.

**Oplossing**: Firebase Admin SDK gebruiken om ID tokens te verifiëren op de backend.

**Taken**:
- [ ] Firebase Admin SDK initialiseren in API (Node.js)
- [ ] Middleware/helper: `verifyFirebaseToken(Authorization header)` 
- [ ] Toepassen op: `app/api/v1/subscriptions/*`, `app/api/v1/categories/*`
- [ ] Bij cookie-based auth: cookie lezen en token verifiëren
- [ ] 401 Unauthorized teruggeven bij ontbrekende/ongeldige token

**Notitie**: Als item 1 (HttpOnly cookies) eerst wordt gedaan, leest de API de cookie server-side; token verificatie blijft hetzelfde.

---

## 4. Security headers (next.config)

**Probleem**: Geen X-Frame-Options, X-Content-Type-Options, Referrer-Policy, etc.

**Oplossing**: Headers toevoegen in `next.config.ts`.

**Taken**:
- [ ] `next.config.ts` uitbreiden met `headers` functie
- [ ] Headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Optioneel: `Content-Security-Policy` (CSP) — pas na testen; kan inline scripts blokkeren

**Voorbeeld**:
```ts
headers: async () => [
  {
    source: "/:path*",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ],
  },
],
```

---

## 5. Hardening foutmeldingen

**Probleem**: Login errors tonen env var namen en implementatiedetails.

**Oplossing**: Generieke gebruikersmeldingen; details alleen server-side loggen.

**Taken**:
- [ ] `app/login/page.tsx`: "Firebase niet geconfigureerd..." → "Inloggen is tijdelijk niet beschikbaar."
- [ ] `app/login/page.tsx`: `err.message` niet direct tonen; gebruik generieke "Inloggen mislukt. Probeer het later opnieuw."
- [ ] Optioneel: server-side logging van echte errors (bijv. via API route)

---

## 6. Token refresh logica

**Probleem**: Firebase ID tokens verlopen (~1 uur); geen refresh.

**Oplossing**: `onAuthStateChanged` + periodiek `getIdToken(true)` om verse token te halen.

**Taken**:
- [ ] In `ApiDataProvider` of auth context: luisteren naar `onAuthStateChanged`
- [ ] Bij token refresh: nieuwe token naar backend sturen (cookie updaten of session verlengen)
- [ ] Bij 401 van API: proberen token te refreshen, daarna redirect naar login
- [ ] Optioneel: proactive refresh vóór expiry (bijv. 5 min voor einde)

---

## Volgorde aanbevolen

1. **Snel te doen**: 4 (headers), 5 (foutmeldingen) — weinig afhankelijkheden
2. **Kern**: 2 (middleware) — directe impact, geen backend wijzigingen
3. **Auth-stack**: 1 (cookies) + 3 (API validatie) — samen uitvoeren
4. **Polish**: 6 (token refresh)

---

## Referenties

- [FIREBASE_SECURE_SETUP.md](./FIREBASE_SECURE_SETUP.md)
- [Security Code Review](../../subscription-tracker) (originele bevindingen)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

*PenPeter — Security Specialist — Implementation Plan*
