import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import {
  createRawMaterial, getRawMaterials, getRawMaterial, updateRawMaterial, deleteRawMaterial,
} from "../controllers/rawMaterialController.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").get(getRawMaterials).post(createRawMaterial);
router.route("/:id").get(getRawMaterial).put(updateRawMaterial).delete(deleteRawMaterial);

export default router;
