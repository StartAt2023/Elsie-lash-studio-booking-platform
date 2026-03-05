import { Router } from "express";
import {
  getServices,
  getService,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
} from "../controllers/serviceController.js";

const router = Router();

router.get("/", getServices);
router.get("/:id", getService);
router.post("/", createServiceHandler);
router.put("/:id", updateServiceHandler);
router.delete("/:id", deleteServiceHandler);

export default router;

