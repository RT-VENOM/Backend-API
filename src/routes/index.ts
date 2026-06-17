import { Router } from "express";
import cookbookRoutes from "../modules/cookbook/cookbook.routes";

const router = Router();

router.use("/cookbook", cookbookRoutes);

export default router;
