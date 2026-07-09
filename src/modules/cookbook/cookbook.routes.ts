// src/modules/cookbook/cookbook.routes.ts

import { Router } from "express";
import { register, login, checkUsername, getMe } from "./cookbook.controller";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login); // <-- Add this line
router.get("/auth/check-username", checkUsername);
router.get("/auth/me", getMe);

export default router;
