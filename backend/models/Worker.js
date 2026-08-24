import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, trim: true },
    dailyWage: { type: Number, default: 0, min: 0 },
    joiningDate: { type: Date },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Worker", workerSchema);
