import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { createBill, getBills, getBill, updateBill, deleteBill } from "../controllers/billController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getBills).post(createBill);
router.route("/:id").get(getBill).put(updateBill).delete(deleteBill);

export default router;
