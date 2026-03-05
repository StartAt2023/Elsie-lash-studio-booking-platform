import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
} from "../controllers/customerController.js";

const router = Router();

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.post("/", createCustomerHandler);
router.put("/:id", updateCustomerHandler);
router.delete("/:id", deleteCustomerHandler);

export default router;

