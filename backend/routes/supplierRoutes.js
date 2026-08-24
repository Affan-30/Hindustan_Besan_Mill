import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier, getSupplierHistory,
} from "../controllers/supplierController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getSuppliers).post(createSupplier);
router.get("/:id/history", getSupplierHistory);
router.route("/:id").get(getSupplier).put(updateSupplier).delete(deleteSupplier);

export default router;
