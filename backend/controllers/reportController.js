import Production from "../models/Production.js";
import WorkerPayment from "../models/WorkerPayment.js";
import OtherPayment from "../models/OtherPayment.js";
import RawMaterialPurchase from "../models/RawMaterialPurchase.js";
import BillPayment from "../models/BillPayment.js";
import Sale from "../models/Sale.js";
import { asyncHandler, AppError } from "../utils/AppError.js";
import { toBusinessDate, todayBusinessDate, startOfMonthBusinessDate, endOfMonthBusinessDate } from "../utils/dateUtils.js";
import { getDateRangeMatch, getFinancialTotals, getSalesTotals, getProductionTotals } from "../services/totalsService.js";

const buildRangeReport = async (from, to) => {
  const match = getDateRangeMatch(from, to);

  const [production, workerPayments, otherPayments, rawMaterials, bills, sales] = await Promise.all([
    Production.find(match).sort("date dalCategory"),
    WorkerPayment.find(match).sort("date"),
    OtherPayment.find(match).sort("date"),
    RawMaterialPurchase.find(match).sort("date"),
    BillPayment.find(match).sort("date"),
    Sale.find(match).sort("date"),
  ]);

  const [financialTotals, salesTotals, productionTotals] = await Promise.all([
    getFinancialTotals(from, to),
    getSalesTotals(from, to),
    getProductionTotals(from, to),
  ]);

  return {
    from: toBusinessDate(from),
    to: toBusinessDate(to),
    production,
    workerPayments,
    otherPayments,
    rawMaterials,
    bills,
    sales,
    totals: { ...financialTotals, ...salesTotals, production: productionTotals },
  };
};

export const getDailyReport = asyncHandler(async (req, res) => {
  const date = req.params.date ? toBusinessDate(req.params.date) : todayBusinessDate();
  const report = await buildRangeReport(date, date);
  res.json({ success: true, data: { ...report, date } });
});

export const getRangeReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) throw new AppError("from and to query params are required.", 400);
  const report = await buildRangeReport(from, to);
  res.json({ success: true, data: report });
});

export const getMonthlyReport = asyncHandler(async (req, res) => {
  const { year, month } = req.params;
  const y = Number(year);
  const m = Number(month);
  if (!y || !m || m < 1 || m > 12) throw new AppError("Invalid year or month.", 400);

  const from = startOfMonthBusinessDate(y, m);
  const to = endOfMonthBusinessDate(y, m);
  const report = await buildRangeReport(from, to);

  // Daily breakdown for charts
  const dailyMap = {};
  const ensureDay = (dateKey) => {
    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = {
        date: dateKey,
        totalBesanKg: 0,
        jadaBesanKg: 0,
        chunniKg: 0,
        workerPayments: 0,
        otherPayments: 0,
        rawMaterials: 0,
        bills: 0,
        sales: 0,
      };
    }
    return dailyMap[dateKey];
  };

  report.production.forEach((p) => {
    const key = p.date.toISOString().slice(0, 10);
    const d = ensureDay(key);
    d.totalBesanKg += p.totalBesanKg;
    d.jadaBesanKg += p.jadaBesanKg;
    d.chunniKg += p.chunniKg;
  });
  report.workerPayments.forEach((p) => (ensureDay(p.date.toISOString().slice(0, 10)).workerPayments += p.amount));
  report.otherPayments.forEach((p) => (ensureDay(p.date.toISOString().slice(0, 10)).otherPayments += p.amount));
  report.rawMaterials.forEach((p) => (ensureDay(p.date.toISOString().slice(0, 10)).rawMaterials += p.totalAmount));
  report.bills.forEach((p) => (ensureDay(p.date.toISOString().slice(0, 10)).bills += p.amount));
  report.sales.forEach((p) => (ensureDay(p.date.toISOString().slice(0, 10)).sales += p.amount));

  const dailyBreakdown = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  const expenseByCategory = [
    { name: "Worker Payments", value: report.totals.totalWorkerPayments },
    { name: "Raw Materials", value: report.totals.totalRawMaterialPurchases },
    { name: "Bills", value: report.totals.totalBillPayments },
    { name: "Other Payments", value: report.totals.totalOtherPayments },
  ];

  res.json({ success: true, data: { ...report, year: y, month: m, dailyBreakdown, expenseByCategory } });
});