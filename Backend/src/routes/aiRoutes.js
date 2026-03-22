import { Router } from "express";
import { postAiHandler } from "../controllers/aiController.js";
import { requireAdminPassword } from "../middleware/adminAuth.js";

const router = Router();

router.post("/", requireAdminPassword, postAiHandler);

export default router;
