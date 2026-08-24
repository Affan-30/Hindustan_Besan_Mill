import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { getDailyReport, getRangeReport, getMonthlyReport } from "../controllers/reportController.js";

const router = express.Router();
router.use(authenticateUser);
router.get("/daily/:date", getDailyReport);
router.get("/monthly/:year/:month", getMonthlyReport);
router.get("/range", getRangeReport);

export default router;
