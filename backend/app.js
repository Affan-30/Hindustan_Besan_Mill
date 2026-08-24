import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import productionRoutes from "./routes/productionRoutes.js";
import workerPaymentRoutes from "./routes/workerPaymentRoutes.js";
import otherPaymentRoutes from "./routes/otherPaymentRoutes.js";
import rawMaterialRoutes from "./routes/rawMaterialRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "Hindustan Besan Mill API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/worker-payments", workerPaymentRoutes);
app.use("/api/payments", otherPaymentRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;