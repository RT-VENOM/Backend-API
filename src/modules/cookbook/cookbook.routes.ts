import { Router } from "express";
import { register, checkUsername } from "./cookbook.controller";

const router = Router();
router.post("/auth/register", register);
router.get("/auth/check-username", checkUsername);

export default router;
