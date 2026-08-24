import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  upsertProduction, getProductions, getProduction, updateProduction, deleteProduction, getProductionByDate,
} from "../controllers/productionController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getProductions).post(upsertProduction);
router.get("/date/:date", getProductionByDate);
router.route("/:id").get(getProduction).put(updateProduction).delete(deleteProduction);

export default router;
