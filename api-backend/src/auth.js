/**
 * Auth middleware — Mock of Firebase token
 * @Floyd — Mock login flow
 *
 * AUTH_MODE=mock → Bearer mock-dev-token → req.userId = mock user UUID
 * Anders: Firebase verify (Fase 2)
 */

import { query } from "./db.js";

const MOCK_TOKEN = "mock-dev-token";
const MOCK_USER_ID = "11111111-1111-1111-1111-111111111111";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (process.env.AUTH_MODE === "mock") {
    if (token === MOCK_TOKEN) {
      req.userId = MOCK_USER_ID;
      return next();
    }
    // Geen token of ongeldige token — anonieme toegang (user_id = null)
    req.userId = null;
    return next();
  }

  // Fase 2: Firebase verify
  // TODO: admin.auth().verifyIdToken(token) → req.userId
  req.userId = null;
  next();
}

/** Zorg dat mock user bestaat (bij AUTH_MODE=mock) */
export async function ensureMockUser() {
  try {
    await query(
      `INSERT INTO users (id, firebase_uid, email, display_name, provider)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (firebase_uid) DO NOTHING`,
      [MOCK_USER_ID, "mock-dev-user", "dev@example.com", "Dev User", "mock"]
    );
  } catch (err) {
    console.warn("ensureMockUser:", err.message);
  }
}
