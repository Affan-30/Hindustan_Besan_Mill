import OtherPayment from "../models/OtherPayment.js";
import { createOne, getAll, getOne, updateOne, deleteOne } from "./crudFactory.js";

export const createOtherPayment = createOne(OtherPayment);
export const getOtherPayments = getAll(OtherPayment, { searchFields: ["description", "paidTo", "category"] });
export const getOtherPayment = getOne(OtherPayment);
export const updateOtherPayment = updateOne(OtherPayment);
export const deleteOtherPayment = deleteOne(OtherPayment);
