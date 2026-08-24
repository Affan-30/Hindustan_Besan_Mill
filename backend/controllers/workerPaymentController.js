import WorkerPayment from "../models/WorkerPayment.js";
import Worker from "../models/Worker.js";
import { AppError, asyncHandler } from "../utils/AppError.js";
import { getAll, getOne, deleteOne } from "./crudFactory.js";

export const createWorkerPayment = asyncHandler(async (req, res) => {
  const { date, workerId, amount, paymentType, paymentMethod, description, notes } = req.body;
  if (!date || !workerId || amount === undefined) {
    throw new AppError("Date, worker and amount are required.", 400);
  }
  if (amount < 0) throw new AppError("Amount cannot be negative.", 400);

  const worker = await Worker.findById(workerId);
  if (!worker) throw new AppError("Selected worker does not exist.", 400);

  const doc = await WorkerPayment.create({
    date,
    workerId,
    workerNameSnapshot: worker.name,
    amount,
    paymentType,
    paymentMethod,
    description,
    notes,
    createdBy: req.user?._id,
  });

  res.status(201).json({ success: true, data: doc });
});

export const getWorkerPayments = getAll(WorkerPayment, { searchFields: ["workerNameSnapshot", "description"] });
export const getWorkerPayment = getOne(WorkerPayment);
export const deleteWorkerPayment = deleteOne(WorkerPayment);

export const updateWorkerPayment = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (amount !== undefined && amount < 0) throw new AppError("Amount cannot be negative.", 400);
  const doc = await WorkerPayment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) throw new AppError("Record not found.", 404);
  res.json({ success: true, data: doc });
});
