import Production from "../models/Production.js";
import { AppError, asyncHandler } from "../utils/AppError.js";
import { toBusinessDate } from "../utils/dateUtils.js";
import { computeProductionKg, DAL_CATEGORIES } from "../utils/productionUnits.js";
import { getAll, getOne, deleteOne } from "./crudFactory.js";

const validateBagCounts = ({ besanBags10Kg = 0, besanBags30Kg = 0, jadaBesanBags50Kg = 0, chunniBags50Kg = 0 }) => {
  const counts = [besanBags10Kg, besanBags30Kg, jadaBesanBags50Kg, chunniBags50Kg];
  if (counts.some((v) => Number(v) < 0)) {
    throw new AppError("Bag counts cannot be negative.", 400);
  }
};

// A production entry is unique per (date, dal category) — so a single day can
// have one entry for Chana Dal and a separate entry for Watana Dal. Saving
// again for a date+category that already has a record updates it instead of
// creating a duplicate.
export const upsertProduction = asyncHandler(async (req, res) => {
  const {
    date, dalCategory, besanBags10Kg = 0, besanBags30Kg = 0,
    jadaBesanBags50Kg = 0, chunniBags50Kg = 0, notes = "",
  } = req.body;

  if (!date) throw new AppError("Date is required.", 400);
  if (!dalCategory || !DAL_CATEGORIES.includes(dalCategory)) {
    throw new AppError("A valid dal category is required.", 400);
  }
  validateBagCounts(req.body);

  const businessDate = toBusinessDate(date);
  const { totalBesanKg, jadaBesanKg, chunniKg } = computeProductionKg(req.body);

  const doc = await Production.findOneAndUpdate(
    { date: businessDate, dalCategory },
    {
      date: businessDate,
      dalCategory,
      besanBags10Kg,
      besanBags30Kg,
      totalBesanKg,
      jadaBesanBags50Kg,
      jadaBesanKg,
      chunniBags50Kg,
      chunniKg,
      notes,
      createdBy: req.user?._id,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, data: doc });
});

export const getProductions = getAll(Production, { defaultSort: "-date" });
export const getProduction = getOne(Production);
export const deleteProduction = deleteOne(Production);

// Returns ALL entries for the given date (e.g. both a Chana Dal and a Watana
// Dal entry), sorted by dal category, rather than a single record.
export const getProductionByDate = asyncHandler(async (req, res) => {
  const businessDate = toBusinessDate(req.params.date);
  const docs = await Production.find({ date: businessDate }).sort("dalCategory");
  res.json({ success: true, data: docs });
});

export const updateProduction = asyncHandler(async (req, res) => {
  const { dalCategory, notes } = req.body;
  if (dalCategory && !DAL_CATEGORIES.includes(dalCategory)) {
    throw new AppError("A valid dal category is required.", 400);
  }
  validateBagCounts(req.body);

  const existing = await Production.findById(req.params.id);
  if (!existing) throw new AppError("Record not found.", 404);

  const merged = { ...existing.toObject(), ...req.body };
  const { totalBesanKg, jadaBesanKg, chunniKg } = computeProductionKg(merged);

  try {
    const doc = await Production.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalBesanKg, jadaBesanKg, chunniKg },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: doc });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("An entry for this date and dal category already exists.", 400);
    }
    throw err;
  }
});