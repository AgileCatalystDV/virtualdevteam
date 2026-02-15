# Mock → Google Cloud Migratie Plan

**Auteur**: Backend Developer Floyd  
**Datum**: 2026-02-14  
**Context**: Hoe de mock API aansluit op de voorziene GCP-architectuur + SSO

---

## 📋 Huidige Staat (Mock)

| Component | Implementatie |
|-----------|---------------|
| **API** | Next.js API routes in `app/api/v1/` |
| **Data** | In-memory mock (geen persistentie) |
| **Auth** | Geen — alle endpoints open |
| **Frontend** | Zustand store (client-side) |

---

## 🎯 Doel: Naadloze overgang naar GCP

### Principe: **Abstraction Layer**

De frontend en API-contract blijven hetzelfde. Alleen de **data source** en **auth** wijzigen.

```
[Frontend] → [API Client] → [Mock API]     (nu)
[Frontend] → [API Client] → [Cloud Run API] (straks)
```

---

## 📐 Aanpassingen voor GCP + SSO

### 1. API Client (lib/api-client.ts)

**Doel**: Eén client die switcht op basis van `NEXT_PUBLIC_API_MODE` (mock | production).

```typescript
// Concept
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export async function fetchSubscriptions(token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const res = await fetch(`${API_BASE}/subscriptions`, { headers });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
```

- **Mock mode**: `API_BASE = /api/v1` (zelfde origin, geen auth)
- **Production**: `API_BASE = https://api.jouwapp.run.app/v1`, token verplicht

### 2. Mock API — Auth-ready maken

De mock API routes kunnen **optioneel** een `Authorization` header accepteren:

```typescript
// app/api/v1/subscriptions/route.ts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  // Mock: negeer voor nu. Production: verify token, filter op userId
  if (authHeader?.startsWith('Bearer ')) {
    // Later: const decoded = await verifyFirebaseToken(authHeader.slice(7));
    // return only subscriptions where user_id = decoded.uid
  }
  return NextResponse.json(MOCK_SUBSCRIPTIONS);
}
```

**Nu**: Mock negeert auth (backward compatible).  
**Straks**: Zelfde route, maar met Cloud Run + echte DB + auth check.

### 3. Database Schema (voor migratie)

Cloud SQL moet dit schema hebben (compatibel met mock):

```sql
-- users (nieuw, voor SSO)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255),
  display_name VARCHAR(255),
  provider VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- subscriptions (uitbreiding)
ALTER TABLE subscriptions ADD COLUMN user_id UUID REFERENCES users(id);
-- Mock data: user_id = NULL of default user
```

### 4. SSO Flow — Frontend wijzigingen

| Stap | Actie |
|------|-------|
| 1 | `npm install firebase` |
| 2 | Firebase config in env vars |
| 3 | Login pagina: "Sign in with Google" button → `signInWithPopup(auth, googleProvider)` |
| 4 | Na login: `user.getIdToken()` → bewaar (cookie via backend of memory) |
| 5 | Bij elke API call: stuur token in `Authorization: Bearer <token>` |
| 6 | Backend: `verifyIdToken()` → userId → filter subscriptions |

---

## 🔄 Migratiepad (geen big bang)

| Fase | Mock | GCP |
|------|------|-----|
| **Nu** | Next.js API routes, Zustand fallback | — |
| **Fase 1** | API client abstractie, env `API_MODE=mock` | — |
| **Fase 2** | Frontend gebruikt API client i.p.v. Zustand | Cloud Run + Cloud SQL deploy |
| **Fase 3** | Auth header in client, mock negeert | Firebase verify in Cloud Run |
| **Fase 4** | — | Volledig GCP, mock uit |

### Tussentijdse compatibiliteit

- **Zustand** kan blijven als **fallback** wanneer `API_MODE=mock` en geen token
- Of: volledig overschakelen naar API client, mock API als backend

---

## 📁 Voorgestelde bestandsstructuur

```
subscription-tracker/
├── lib/
│   ├── api-client.ts      # NIEUW — fetch wrappers, auth header
│   ├── auth.ts            # NIEUW — Firebase init, getToken()
│   ├── store.ts           # Blijft voor offline/mock fallback (optioneel)
│   └── types.ts
├── app/
│   ├── api/v1/            # Mock — zelfde contract als Cloud Run
│   │   ├── subscriptions/
│   │   └── categories/
│   └── (auth)/login/      # NIEUW — login pagina met SSO buttons
```

---

## ✅ Conclusie Floyd

De mock **sluit direct aan** op de voorziene GCP-architectuur:

1. **API contract** is identiek — geen wijziging in request/response format
2. **Auth** — voeg `Authorization` header toe; mock negeert, Cloud Run verifieert
3. **user_id** — enige schema-uitbreiding; mock kan `user_id: null` gebruiken
4. **SSO** — Firebase in frontend, Admin SDK in backend; mock blijft werken zonder auth

**Aanbeveling**: Implementeer `lib/api-client.ts` nu. Frontend kan dan later in één switch van Zustand naar API client. Mock API blijft bruikbaar tot Cloud Run live is.

---

*Floyd — Backend Developer — Mock to GCP Migration*
