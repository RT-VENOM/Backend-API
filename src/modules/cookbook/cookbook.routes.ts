// src/modules/cookbook/cookbook.routes.ts

import { Router } from "express";
import {
  register,
  login,
  checkUsername,
  getMe,
  createRecipe,
  updateAvatar,
} from "./cookbook.controller";
import { upload } from "../../middleware/upload";
import { requireAuth } from "../../middleware/auth.middleware";
const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login); // <-- Add this line
router.get("/auth/check-username", checkUsername);
router.get("/auth/me", getMe);
router.post(
  "/cookbook/recipes",
  requireAuth,
  upload.single("image"),
  createRecipe,
);

router.put(
  "/cookbook/profile/avatar",
  requireAuth,
  upload.single("avatar"),
  updateAvatar,
);
export default router;
