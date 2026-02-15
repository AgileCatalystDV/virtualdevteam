/**
 * Subscriptions API — CRUD /v1/subscriptions
 * @Floyd — Sprint 5
 *
 * Auth: Authorization Bearer <token> — verify via Firebase Admin SDK (Fase 2)
 * Nu: user_id = null (geen auth)
 */

import { Router } from "express";
import { query } from "../db.js";

export const subscriptionsRouter = Router();

function rowToSubscription(row) {
  return {
    id: row.id,
    name: row.name,
    price: parseFloat(row.price),
    currency: row.currency,
    billingCycle: row.billing_cycle,
    categoryId: row.category_id,
    nextBillingDate: row.next_billing_date?.toISOString().slice(0, 10) ?? undefined,
    notes: row.notes ?? "",
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

// GET /v1/subscriptions
subscriptionsRouter.get("/", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM subscriptions WHERE (user_id IS NULL OR user_id = $1) AND is_active = true ORDER BY created_at DESC",
      [null] // TODO: decoded.uid when auth
    );
    res.json(result.rows.map(rowToSubscription));
  } catch (err) {
    console.error("Subscriptions GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /v1/subscriptions/:id
subscriptionsRouter.get("/:id", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM subscriptions WHERE id = $1 AND (user_id IS NULL OR user_id = $2)",
      [req.params.id, null]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(rowToSubscription(result.rows[0]));
  } catch (err) {
    console.error("Subscription GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /v1/subscriptions
subscriptionsRouter.post("/", async (req, res) => {
  try {
    const { name, price, currency, billingCycle, categoryId, nextBillingDate, notes } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ error: "name and price required" });
    }
    const result = await query(
      `INSERT INTO subscriptions (user_id, name, price, currency, billing_cycle, category_id, next_billing_date, notes, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
       RETURNING *`,
      [null, name, price ?? 0, currency ?? "EUR", billingCycle ?? "monthly", categoryId ?? "cat-other", nextBillingDate || null, notes ?? ""]
    );
    res.status(201).json(rowToSubscription(result.rows[0]));
  } catch (err) {
    console.error("Subscription POST error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /v1/subscriptions/:id
subscriptionsRouter.put("/:id", async (req, res) => {
  try {
    const { name, price, currency, billingCycle, categoryId, nextBillingDate, notes, isActive } = req.body;
    const result = await query(
      `UPDATE subscriptions SET
        name = COALESCE($2, name),
        price = COALESCE($3, price),
        currency = COALESCE($4, currency),
        billing_cycle = COALESCE($5, billing_cycle),
        category_id = COALESCE($6, category_id),
        next_billing_date = $7,
        notes = COALESCE($8, notes),
        is_active = COALESCE($9, is_active),
        updated_at = NOW()
       WHERE id = $1 AND (user_id IS NULL OR user_id = $10)
       RETURNING *`,
      [req.params.id, name, price, currency, billingCycle, categoryId, nextBillingDate || null, notes, isActive, null]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(rowToSubscription(result.rows[0]));
  } catch (err) {
    console.error("Subscription PUT error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /v1/subscriptions/:id
subscriptionsRouter.delete("/:id", async (req, res) => {
  try {
    const result = await query(
      "DELETE FROM subscriptions WHERE id = $1 AND (user_id IS NULL OR user_id = $2) RETURNING id",
      [req.params.id, null]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Subscription DELETE error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
