// POST /api/auth/validate-document
// POST /api/auth/request-otp
// POST /api/auth/verify-otp
// GET  /api/auth/me

import { Router } from "express";

import {
  validateCedula,
  registerUser,
  getMe,
} from "../controllers/auth.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  validateCedula as validateCedulaMiddleware,
} from "../middlewares/validate.middleware.js";

import {
  authRateLimit,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post(
  "/validate-cedula",
  authRateLimit,
  validateCedulaMiddleware,
  validateCedula
);

router.post(
  "/register",
  authMiddleware,
  registerUser
);

router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;