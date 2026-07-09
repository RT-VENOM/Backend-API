import { Router } from "express";
import { register, checkUsername } from "./cookbook.controller";
import { getMe } from "./cookbook.controller";
const router = Router();
router.post("/auth/register", register);
router.get("/auth/check-username", checkUsername);
router.get("/auth/me", getMe);
export default router;
