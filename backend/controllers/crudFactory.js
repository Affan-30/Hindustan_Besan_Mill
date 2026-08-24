import { AppError, asyncHandler } from "../utils/AppError.js";

// Generic CRUD controller factory used by simple modules (Worker, Supplier,
// OtherPayment, BillPayment). Modules with extra business logic (Production,
// WorkerPayment, RawMaterialPurchase) build on top of this or implement their own.

export const createOne = (Model, { beforeSave } = {}) =>
  asyncHandler(async (req, res) => {
    const payload = beforeSave ? await beforeSave(req.body, req) : req.body;
    const doc = await Model.create(payload);
    res.status(201).json({ success: true, data: doc });
  });

export const getAll = (Model, { defaultSort = "-date", searchFields = [] } = {}) =>
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, search, from, to, sort } = req.query;
    const query = {};

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    Object.keys(req.query).forEach((key) => {
      if (["page", "limit", "search", "from", "to", "sort"].includes(key)) return;
      query[key] = req.query[key];
    });

    if (search && searchFields.length) {
      query.$or = searchFields.map((f) => ({ [f]: { $regex: search, $options: "i" } }));
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Model.find(query).sort(sort || defaultSort).skip(skip).limit(Number(limit)),
      Model.countDocuments(query),
    ]);

    res.json({
      success: true,
      data,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  });

export const getOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw new AppError("Record not found.", 404);
    res.json({ success: true, data: doc });
  });

export const updateOne = (Model, { beforeSave } = {}) =>
  asyncHandler(async (req, res) => {
    const payload = beforeSave ? await beforeSave(req.body, req) : req.body;
    const doc = await Model.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new AppError("Record not found.", 404);
    res.json({ success: true, data: doc });
  });

export const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new AppError("Record not found.", 404);
    res.json({ success: true, message: "Entry deleted." });
  });
