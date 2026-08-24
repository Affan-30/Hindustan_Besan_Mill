import mongoose from "mongoose";

const workerPaymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    workerNameSnapshot: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentType: { type: String, enum: ["Daily Wage", "Advance", "Overtime", "Other"], default: "Daily Wage" },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], default: "Cash" },
    description: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

workerPaymentSchema.index({ date: 1 });
workerPaymentSchema.index({ workerId: 1 });

export default mongoose.model("WorkerPayment", workerPaymentSchema);
