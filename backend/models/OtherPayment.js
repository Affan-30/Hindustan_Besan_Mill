import mongoose from "mongoose";

const otherPaymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: ["Transport", "Diesel", "Fuel", "Repair", "Maintenance", "Packaging",
        "Loading/Unloading", "Tea/Food", "Office Expense","Self-Travel", "Miscellaneous", "Other"],
      required: true,
    },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidTo: { type: String, trim: true },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], default: "Cash" },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

otherPaymentSchema.index({ date: 1 });
otherPaymentSchema.index({ category: 1 });

export default mongoose.model("OtherPayment", otherPaymentSchema);
