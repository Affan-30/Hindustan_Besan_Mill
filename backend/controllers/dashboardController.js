import Production from "../models/Production.js";
import WorkerPayment from "../models/WorkerPayment.js";
import OtherPayment from "../models/OtherPayment.js";
import RawMaterialPurchase from "../models/RawMaterialPurchase.js";
import BillPayment from "../models/BillPayment.js";
import Sale from "../models/Sale.js";
import { asyncHandler } from "../utils/AppError.js";
import { toBusinessDate } from "../utils/dateUtils.js";
import { getDateRangeMatch, getFinancialTotals, getSalesTotals, getProductionTotals } from "../services/totalsService.js";

// Combines everything needed for a given day's dashboard/report into one
// call so the frontend doesn't need to make 5+ separate requests.
export const getDailyDashboard = asyncHandler(async (req, res) => {
  const date = toBusinessDate(req.params.date);
  const prevDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const match = getDateRangeMatch(date, date);

  const [production, workerPayments, otherPayments, rawMaterials, bills, sales] = await Promise.all([
    Production.find(match).sort("dalCategory"),
    WorkerPayment.find(match).sort("-createdAt"),
    OtherPayment.find(match).sort("-createdAt"),
    RawMaterialPurchase.find(match).sort("-createdAt"),
    BillPayment.find(match).sort("-createdAt"),
    Sale.find(match).sort("-createdAt"),
  ]);

  const [totals, prevTotals, salesTotals, prevSalesTotals, productionTotals, prevProductionTotals] = await Promise.all([
    getFinancialTotals(date, date),
    getFinancialTotals(prevDate, prevDate),
    getSalesTotals(date, date),
    getSalesTotals(prevDate, prevDate),
    getProductionTotals(date, date),
    getProductionTotals(prevDate, prevDate),
  ]);

  res.json({
    success: true,
    data: {
      date,
      production, // array — may contain a separate entry per dal category for the day
      workerPayments,
      otherPayments,
      rawMaterials,
      bills,
      sales,
      totals: { ...totals, ...salesTotals, production: productionTotals },
      previousDay: { ...prevTotals, ...prevSalesTotals, production: prevProductionTotals },
    },
  });
});