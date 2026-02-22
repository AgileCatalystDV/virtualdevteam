/**
 * Subscription Tracker API — Express backend voor Cloud Run
 * @Floyd — Sprint 5
 *
 * Base path: /v1 (NEXT_PUBLIC_API_URL = https://api.xxx.run.app/v1)
 * AUTH_MODE=mock → mock token voor lokale dev
 */

import express from "express";
import cors from "cors";
import { authMiddleware, ensureMockUser } from "./auth.js";
import { categoriesRouter } from "./routes/categories.js";
import { subscriptionsRouter } from "./routes/subscriptions.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check (Cloud Run)
app.get("/", (req, res) => res.json({ status: "ok", service: "subscription-tracker-api" }));

// API v1 — auth middleware voor subscriptions (user-scoped data)
app.use("/v1/categories", categoriesRouter);
app.use("/v1/subscriptions", authMiddleware, subscriptionsRouter);

app.listen(PORT, async () => {
  if (process.env.AUTH_MODE === "mock") {
    await ensureMockUser();
  }
  console.log(
    `Subscription Tracker API listening on port ${PORT}${process.env.AUTH_MODE === "mock" ? " (AUTH_MODE=mock)" : ""}`
  );
});
