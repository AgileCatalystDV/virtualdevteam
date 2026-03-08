/**
 * Subscription Tracker API — Express backend voor Cloud Run
 * @Floyd — Sprint 5, 7 (CORS + Helmet)
 *
 * Base path: /v1 (NEXT_PUBLIC_API_URL = https://api.xxx.run.app/v1)
 * AUTH_MODE=mock → mock token voor lokale dev
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authMiddleware, ensureMockUser } from "./auth.js";
import { categoriesRouter } from "./routes/categories.js";
import { subscriptionsRouter } from "./routes/subscriptions.js";

const app = express();
const PORT = process.env.PORT || 8080;

// CORS — frontend Cloud Run URL + localhost voor dev
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CORS_ORIGIN || "https://subscription-tracker-web-761770841827.europe-west1.run.app",
].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

app.use(helmet());
app.use(express.json({ limit: "50kb" }));

// Health check (Cloud Run)
app.get("/", (req, res) => res.json({ status: "ok", service: "subscription-tracker-api" }));

// API v1 — auth middleware voor subscriptions (user-scoped data)
app.use("/v1/categories", categoriesRouter);
app.use("/v1/subscriptions", authMiddleware, subscriptionsRouter);

// Globaal error handler — geen stack traces in productie (I2)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

app.listen(PORT, async () => {
  if (process.env.AUTH_MODE === "mock") {
    await ensureMockUser();
  }
  console.log(
    `Subscription Tracker API listening on port ${PORT}${process.env.AUTH_MODE === "mock" ? " (AUTH_MODE=mock)" : ""}`
  );
});
