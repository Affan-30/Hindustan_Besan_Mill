import mongoose from "mongoose";

// A Sale record represents money coming IN — a payment received from a party
// (customer/buyer). This is intentionally simple (no invoice/ledger linkage)
// and is kept separate from the expense modules (Worker/OtherPayment/
// RawMaterial/Bill), which represent money going OUT.
const saleSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    partyName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], default: "Cash" },
    referenceNumber: { type: String, trim: true }, // optional bill/invoice/receipt number
    description: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

saleSchema.index({ date: 1 });
saleSchema.index({ partyName: 1 });

export default mongoose.model("Sale", saleSchema);