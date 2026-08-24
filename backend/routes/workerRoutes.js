import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createWorker, getWorkers, getWorker, updateWorker, deleteWorker, getWorkerHistory,
} from "../controllers/workerController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getWorkers).post(createWorker);
router.get("/:id/history", getWorkerHistory);
router.route("/:id").get(getWorker).put(updateWorker).delete(deleteWorker);

export default router;
