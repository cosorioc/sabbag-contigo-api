// POST   /api/submissions/:id/like
// DELETE /api/submissions/:id/like

import { Router } from "express";

import {
  likePost,
  unlikePost,
  checkLike,
  getMyLikes,
} from "../controllers/like.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:submissionId", authMiddleware, likePost);
router.delete("/:submissionId", authMiddleware, unlikePost);
router.get("/me/count", authMiddleware, getMyLikes);
router.get("/:submissionId", authMiddleware, checkLike);

export default router;
