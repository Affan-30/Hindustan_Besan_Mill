import Sale from "../models/Sale.js";
import { createOne, getAll, getOne, updateOne, deleteOne } from "./crudFactory.js";

export const createSale = createOne(Sale);
export const getSales = getAll(Sale, { searchFields: ["partyName", "referenceNumber", "description"] });
export const getSale = getOne(Sale);
export const updateSale = updateOne(Sale);
export const deleteSale = deleteOne(Sale);