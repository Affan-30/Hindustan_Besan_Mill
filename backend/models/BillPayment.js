import mongoose from "mongoose";

const billPaymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    billType: {
      type: String,
      enum: ["Electricity", "Water", "Rent", "Internet", "Telephone", "GST/Tax",
        "Machinery", "Insurance", "Other"],
      required: true,
    },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    billingPeriod: { type: String, trim: true },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], default: "Cash" },
    billNumber: { type: String, trim: true },
    paidTo: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

billPaymentSchema.index({ date: 1 });
billPaymentSchema.index({ billType: 1 });

export default mongoose.model("BillPayment", billPaymentSchema);
