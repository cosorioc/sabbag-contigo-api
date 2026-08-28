// GET  /api/challenges
// GET  /api/challenges/:id
// POST /api/challenges/:id/submit

import { Router } from "express";

import {
  getAllChallenges,
  getChallenge,
  getMyChallenges,
  completeChallenge,
} from "../controllers/challenge.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";
import { validateChallengeId } from "../middlewares/validate.middleware.js";
import { uploadRateLimit } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.get("/", authMiddleware, getAllChallenges);
router.get("/me", authMiddleware, getMyChallenges);
router.get("/:challengeId", authMiddleware, validateChallengeId, getChallenge);
router.post(
  "/:challengeId/complete",
  authMiddleware,
  uploadRateLimit,
  validateChallengeId,
  uploadImage.single("image"),
  completeChallenge,
);

export default router;
