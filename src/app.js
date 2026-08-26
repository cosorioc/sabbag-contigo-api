import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import challengeRoutes from "./routes/challenge.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import likeRoutes from "./routes/like.routes.js";
import rankingRoutes from "./routes/ranking.routes.js";

import { generalRateLimit } from "./middlewares/rateLimit.middleware.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(generalRateLimit);

app.get("/api/status", (req, res) => {
  console.log("[API] Ping recibido en /status");

  res.json({
    ok: true,
    message: "API Funcionando",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/challenges", challengeRoutes);

app.use("/api/feed", feedRoutes);

app.use("/api/likes", likeRoutes);

app.use("/api/ranking", rankingRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    path: req.originalUrl,
  });
});

app.use(errorMiddleware);

export default app;
