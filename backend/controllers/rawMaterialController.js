import RawMaterialPurchase from "../models/RawMaterialPurchase.js";
import Supplier from "../models/Supplier.js";
import { AppError, asyncHandler } from "../utils/AppError.js";
import { getAll, getOne, deleteOne } from "./crudFactory.js";

const computeAmounts = ({ quantity, rate, paymentStatus, paidAmount }) => {
  if (quantity < 0 || rate < 0) throw new AppError("Quantity and rate cannot be negative.", 400);
  const totalAmount = Math.round(quantity * rate * 100) / 100;

  let paid = 0;
  if (paymentStatus === "Paid") paid = totalAmount;
  else if (paymentStatus === "Credit") paid = 0;
  else paid = Math.min(Number(paidAmount) || 0, totalAmount);

  const remaining = Math.round((totalAmount - paid) * 100) / 100;
  return { totalAmount, paidAmount: paid, remainingAmount: remaining };
};

export const createRawMaterial = asyncHandler(async (req, res) => {
  const { date, material, supplierId, quantity, rate } = req.body;
  if (!date || !material || !supplierId || quantity === undefined || rate === undefined) {
    throw new AppError("Date, material, supplier, quantity and rate are required.", 400);
  }

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) throw new AppError("Selected supplier does not exist.", 400);

  const { totalAmount, paidAmount, remainingAmount } = computeAmounts(req.body);

  const doc = await RawMaterialPurchase.create({
    ...req.body,
    supplierNameSnapshot: supplier.name,
    totalAmount,
    paidAmount,
    remainingAmount,
    createdBy: req.user?._id,
  });

  res.status(201).json({ success: true, data: doc });
});

export const getRawMaterials = getAll(RawMaterialPurchase, {
  searchFields: ["material", "supplierNameSnapshot", "invoiceNumber"],
});
export const getRawMaterial = getOne(RawMaterialPurchase);
export const deleteRawMaterial = deleteOne(RawMaterialPurchase);

export const updateRawMaterial = asyncHandler(async (req, res) => {
  const existing = await RawMaterialPurchase.findById(req.params.id);
  if (!existing) throw new AppError("Record not found.", 404);

  const merged = { ...existing.toObject(), ...req.body };
  const { totalAmount, paidAmount, remainingAmount } = computeAmounts(merged);

  const doc = await RawMaterialPurchase.findByIdAndUpdate(
    req.params.id,
    { ...req.body, totalAmount, paidAmount, remainingAmount },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: doc });
});
