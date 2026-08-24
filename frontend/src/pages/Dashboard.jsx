import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wheat, Layers, Scissors, Banknote, Receipt, Package, FileBarChart, DollarSign,
  FileText, IndianRupee, TrendingUp,
} from "lucide-react";
import { DashboardAPI } from "../services/resources.js";
import { formatCurrency, formatDateDisplay, todayISODate } from "../utils/format.js";
import { getErrorMessage } from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import Card from "../components/ui/Card.jsx";
import Spinner from "../components/ui/Spinner.jsx";

import EmptyState from "../components/ui/EmptyState.jsx";

const quickActions = [
  { to: "/app/daily-entry", label: "Add Production", icon: Wheat },
  { to: "/app/daily-entry", label: "Add Worker Payment", icon: Banknote },
  { to: "/app/daily-entry", label: "Add Payment", icon: Receipt },
  { to: "/app/daily-entry", label: "Add Raw Material", icon: Package },
  { to: "/app/daily-entry", label: "Add Bill", icon: FileBarChart },
  { to: "/app/daily-entry", label: "Add Payment Received", icon: IndianRupee },
  { to: "/app/reports/daily", label: "View Today's Report", icon: FileText },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const today = todayISODate();

  useEffect(() => {
    DashboardAPI.daily(today)
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="min-h-[60vh]" />;

  const totals = data?.totals || {};
  const prev = data?.previousDay || {};
  // Raw per-entry production records for today (one per dal category) — shown
  // individually rather than summed, so Chana Dal and Watana Dal entries both stay visible.
  const production = data?.production || [];
  const netPosition = (totals.totalSales || 0) - (totals.totalDailyExpenses || 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
        <p className="text-ink-800/60">{formatDateDisplay(today)}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-800/70 mb-3">Today's Production</p>
        {production.length === 0 ? (
          <Card className="p-5">
            <EmptyState message="No production recorded for today." />
          </Card>
        ) : (
          <div className="space-y-5">
            {production.map((entry) => (
              <div key={entry._id}>
                <p className="text-xs font-semibold text-mustard-600 uppercase tracking-wide mb-2">{entry.dalCategory}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <SummaryCard
                    icon={Wheat}
                    title="Besan Production"
                    value={entry.totalBesanKg}
                    unit="kg"
                    accent="mustard"
                    subtitle={`${entry.besanBags10Kg || 0} × 10kg bags, ${entry.besanBags30Kg || 0} × 30kg bags`}
                  />
                  <SummaryCard
                    icon={Layers}
                    title="Jada Besan"
                    value={entry.jadaBesanKg}
                    unit="kg"
                    accent="mustard"
                    subtitle={`${entry.jadaBesanBags50Kg || 0} × 50kg bags`}
                  />
                  <SummaryCard
                    icon={Scissors}
                    title="Chunni"
                    value={entry.chunniKg}
                    unit="kg"
                    accent="mustard"
                    subtitle={`${entry.chunniBags50Kg || 0} × 50kg bags`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-800/70 mb-3">Today's Sales (Payment Received)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SummaryCard icon={IndianRupee} title="Today's Sales" value={totals.totalSales} previous={prev.totalSales} format={formatCurrency} accent="leaf" />
          <SummaryCard icon={TrendingUp} title="Today's Payments Received" value={totals.salesCount || 0} previous={prev.salesCount} accent="leaf" />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink-800/70 mb-3">Today's Expenses</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard icon={Banknote} title="Worker Payments" value={totals.totalWorkerPayments} previous={prev.totalWorkerPayments} format={formatCurrency} accent="brick" />
          <SummaryCard icon={Receipt} title="Other Payments" value={totals.totalOtherPayments} previous={prev.totalOtherPayments} format={formatCurrency} accent="brick" />
          <SummaryCard icon={Package} title="Raw Material Purchase" value={totals.totalRawMaterialPurchases} previous={prev.totalRawMaterialPurchases} format={formatCurrency} accent="brick" />
          <SummaryCard icon={FileBarChart} title="Bill Payments" value={totals.totalBillPayments} previous={prev.totalBillPayments} format={formatCurrency} accent="brick" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 sm:p-6 bg-ink-900 border-none">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-mustard-500 flex items-center justify-center text-white">
              <DollarSign size={22} />
            </div>
            <div>
              <p className="text-mustard-700 text-sm">Total Daily Expenses</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold text-black">
                {formatCurrency(totals.totalDailyExpenses)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 bg-leaf-600 border-none">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-mustard-500 flex items-center justify-center text-white">
              <IndianRupee size={22} />
            </div>
            <div>
              <p className="text-mustard-700 text-sm">Total Sales (Money In)</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold text-black">
                {formatCurrency(totals.totalSales)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-ink-800/70">
          Net position for today (Sales − Expenses):{" "}
          <span className={`font-semibold ${netPosition >= 0 ? "text-leaf-600" : "text-brick-600"}`}>
            {formatCurrency(netPosition)}
          </span>
        </p>
        <button
          onClick={() => navigate("/reports/daily")}
          className="text-sm font-semibold text-mustard-600 hover:text-mustard-700"
        >
          View full report →
        </button>
      </Card>

      <div>
        <p className="text-sm font-semibold text-ink-800/70 mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {quickActions.map(({ to, label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-wheat-200 bg-white hover:bg-wheat-100 py-5 px-2 text-center shadow-card transition-colors"
            >
              <Icon size={22} className="text-mustard-600" />
              <span className="text-xs font-semibold text-ink-800 leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}