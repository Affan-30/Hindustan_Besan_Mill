import Worker from "../models/Worker.js";
import WorkerPayment from "../models/WorkerPayment.js";
import { createOne, getAll, getOne, updateOne, deleteOne } from "./crudFactory.js";
import { asyncHandler } from "../utils/AppError.js";

export const createWorker = createOne(Worker);
export const getWorkers = getAll(Worker, { defaultSort: "name", searchFields: ["name", "mobile"] });
export const getWorker = getOne(Worker);
export const updateWorker = updateOne(Worker);
export const deleteWorker = deleteOne(Worker);

export const getWorkerHistory = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const query = { workerId: req.params.id };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }
  const payments = await WorkerPayment.find(query).sort("-date");
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  res.json({ success: true, data: payments, totalPaid });
});
