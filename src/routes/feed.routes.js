// GET /api/feed

import { Router } from "express";

import { getFeedController } from "../controllers/feed.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getFeedController);

export default router;
