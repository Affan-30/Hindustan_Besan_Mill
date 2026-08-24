import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { createSale, getSales, getSale, updateSale, deleteSale } from "../controllers/saleController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getSales).post(createSale);
router.route("/:id").get(getSale).put(updateSale).delete(deleteSale);

export default router;