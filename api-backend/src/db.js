/**
 * PostgreSQL connection — Cloud SQL
 * @Floyd — Sprint 5
 *
 * DATABASE_URL from Secret Manager (Cloud Run) or env
 */

import pg from "pg";

const { Pool } = pg;

// Unix socket (Cloud Run): no SSL needed. Public IP: use SSL with cert verification.
const useUnixSocket = process.env.DATABASE_URL?.includes("/cloudsql/");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useUnixSocket
    ? false
    : process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export default pool;
