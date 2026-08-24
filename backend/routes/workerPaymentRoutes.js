import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createWorkerPayment, getWorkerPayments, getWorkerPayment, updateWorkerPayment, deleteWorkerPayment,
} from "../controllers/workerPaymentController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getWorkerPayments).post(createWorkerPayment);
router.route("/:id").get(getWorkerPayment).put(updateWorkerPayment).delete(deleteWorkerPayment);

export default router;
