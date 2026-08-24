import WorkerPayment from "../models/WorkerPayment.js";
import OtherPayment from "../models/OtherPayment.js";
import RawMaterialPurchase from "../models/RawMaterialPurchase.js";
import BillPayment from "../models/BillPayment.js";
import Sale from "../models/Sale.js";
import Production from "../models/Production.js";
import { toBusinessDate } from "../utils/dateUtils.js";

// Backend is the single source of truth for all financial totals.
// Never trust totals computed on the frontend.

const sumAmount = async (Model, match) => {
  const result = await Model.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
  return result[0]?.total || 0;
};

export const getDateRangeMatch = (from, to) => ({
  date: { $gte: toBusinessDate(from), $lte: toBusinessDate(to) },
});

export const getFinancialTotals = async (from, to) => {
  const match = getDateRangeMatch(from, to);

  const [workerPayments, otherPayments, bills] = await Promise.all([
    sumAmount(WorkerPayment, match),
    sumAmount(OtherPayment, match),
    sumAmount(BillPayment, match),
  ]);

  const rawMaterialAgg = await RawMaterialPurchase.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const rawMaterials = rawMaterialAgg[0]?.total || 0;

  const totalDailyExpenses = workerPayments + otherPayments + rawMaterials + bills;

  return {
    totalWorkerPayments: workerPayments,
    totalOtherPayments: otherPayments,
    totalRawMaterialPurchases: rawMaterials,
    totalBillPayments: bills,
    totalDailyExpenses,
  };
};

// Sales (payments received) are money coming IN and are intentionally kept
// separate from getFinancialTotals — they must never be added into, or
// netted against, totalDailyExpenses.
export const getSalesTotals = async (from, to) => {
  const match = getDateRangeMatch(from, to);
  const [count, total] = await Promise.all([
    Sale.countDocuments(match),
    sumAmount(Sale, match),
  ]);
  return { totalSales: total, salesCount: count };
};

export const getProductionTotals = async (from, to) => {
  const match = getDateRangeMatch(from, to);
  const agg = await Production.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalBesanKg: { $sum: "$totalBesanKg" },
        jadaBesanKg: { $sum: "$jadaBesanKg" },
        chunniKg: { $sum: "$chunniKg" },
        besanBags10Kg: { $sum: "$besanBags10Kg" },
        besanBags30Kg: { $sum: "$besanBags30Kg" },
        jadaBesanBags50Kg: { $sum: "$jadaBesanBags50Kg" },
        chunniBags50Kg: { $sum: "$chunniBags50Kg" },
        dalCategories: { $addToSet: "$dalCategory" },
      },
    },
  ]);

  if (!agg[0]) {
    return {
      totalBesanKg: 0, jadaBesanKg: 0, chunniKg: 0,
      besanBags10Kg: 0, besanBags30Kg: 0, jadaBesanBags50Kg: 0, chunniBags50Kg: 0,
      dalCategory: null,
    };
  }

  const { dalCategories, ...rest } = agg[0];
  // Only show a single dal category when the whole range used just one
  // (e.g. a single day's report) — across a mixed range it's ambiguous.
  const dalCategory = dalCategories.length === 1 ? dalCategories[0] : null;

  return {
    totalBesanKg: rest.totalBesanKg,
    jadaBesanKg: rest.jadaBesanKg,
    chunniKg: rest.chunniKg,
    besanBags10Kg: rest.besanBags10Kg,
    besanBags30Kg: rest.besanBags30Kg,
    jadaBesanBags50Kg: rest.jadaBesanBags50Kg,
    chunniBags50Kg: rest.chunniBags50Kg,
    dalCategory,
  };
};