/**
 * Categories API — GET /v1/categories
 * @Floyd — Sprint 5
 */

import { Router } from "express";
import { query } from "../db.js";

export const categoriesRouter = Router();

// GET /v1/categories
categoriesRouter.get("/", async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, icon, color FROM categories ORDER BY name"
    );
    const categories = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
    }));
    res.json(categories);
  } catch (err) {
    console.error("Categories GET error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
