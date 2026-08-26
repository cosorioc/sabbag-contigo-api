// GET /api/ranking

import { Router } from "express";

import {
    getRankingController,
    getMyRanking,
} from "../controllers/ranking.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, getRankingController);

router.get("/me", authMiddleware, getMyRanking);

export default router;
