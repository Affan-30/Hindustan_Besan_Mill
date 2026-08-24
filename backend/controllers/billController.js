import BillPayment from "../models/BillPayment.js";
import { createOne, getAll, getOne, updateOne, deleteOne } from "./crudFactory.js";

export const createBill = createOne(BillPayment);
export const getBills = getAll(BillPayment, { searchFields: ["description", "paidTo", "billNumber", "billType"] });
export const getBill = getOne(BillPayment);
export const updateBill = updateOne(BillPayment);
export const deleteBill = deleteOne(BillPayment);
