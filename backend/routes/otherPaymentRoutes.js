import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createOtherPayment, getOtherPayments, getOtherPayment, updateOtherPayment, deleteOtherPayment,
} from "../controllers/otherPaymentController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getOtherPayments).post(createOtherPayment);
router.route("/:id").get(getOtherPayment).put(updateOtherPayment).delete(deleteOtherPayment);

export default router;
