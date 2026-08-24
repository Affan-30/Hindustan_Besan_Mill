import Supplier from "../models/Supplier.js";
import RawMaterialPurchase from "../models/RawMaterialPurchase.js";
import { createOne, getAll, getOne, updateOne, deleteOne } from "./crudFactory.js";
import { asyncHandler } from "../utils/AppError.js";

export const createSupplier = createOne(Supplier);
export const getSuppliers = getAll(Supplier, { defaultSort: "name", searchFields: ["name", "mobile", "materialsSupplied"] });
export const getSupplier = getOne(Supplier);
export const updateSupplier = updateOne(Supplier);
export const deleteSupplier = deleteOne(Supplier);

export const getSupplierHistory = asyncHandler(async (req, res) => {
  const purchases = await RawMaterialPurchase.find({ supplierId: req.params.id }).sort("-date");
  const totalPurchases = purchases.reduce((s, p) => s + p.totalAmount, 0);
  const totalPaid = purchases.reduce((s, p) => s + p.paidAmount, 0);
  const totalCredit = purchases.reduce((s, p) => s + p.remainingAmount, 0);
  res.json({ success: true, data: purchases, totalPurchases, totalPaid, totalCredit });
});
