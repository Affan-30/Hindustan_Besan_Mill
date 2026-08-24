import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    material: { type: String, enum: ["Chana Dal", "Watana Dal", "Other"], required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    supplierNameSnapshot: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["Kg", "Quintal", "Ton"], default: "Kg" },
    rate: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ["Paid", "Partially Paid", "Credit"], default: "Paid" },
    paidAmount: { type: Number, default: 0, min: 0 },
    remainingAmount: { type: Number, default: 0, min: 0 },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], default: "Cash" },
    invoiceNumber: { type: String, trim: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

rawMaterialSchema.index({ date: 1 });
rawMaterialSchema.index({ supplierId: 1 });
rawMaterialSchema.index({ material: 1 });

export default mongoose.model("RawMaterialPurchase", rawMaterialSchema);
