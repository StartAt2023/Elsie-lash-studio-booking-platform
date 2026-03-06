import { Router } from "express";
import { getContent, updateContent } from "../controllers/contentController.js";

const router = Router();

router.get("/", getContent);
router.put("/", updateContent);

export default router;
