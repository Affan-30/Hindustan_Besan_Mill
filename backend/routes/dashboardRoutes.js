import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { getDailyDashboard } from "../controllers/dashboardController.js";

const router = express.Router();
router.use(authenticateUser);
router.get("/daily/:date", getDailyDashboard);

export default router;
