import { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { ReportsAPI } from "../../services/resources.js";
import { formatCurrency, formatKg } from "../../utils/format.js";
import { getErrorMessage } from "../../services/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import Card from "../../components/ui/Card.jsx";
import Select from "../../components/ui/Select.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import SummaryCard from "../../components/SummaryCard.jsx";
import { Wheat, Layers, Scissors, DollarSign, IndianRupee } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const COLORS = ["#C08A2E", "#A8492F", "#4C6B3F", "#7A5619"];

const now = new Date();

export default function MonthlyReport() {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    ReportsAPI.monthly(year, month)
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [year, month]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Monthly Summary</h1>
          <p className="text-ink-800/60 text-sm">Production and expense trends for the selected month.</p>
        </div>
        <div className="flex gap-2">
          <Select options={MONTHS.map((m, i) => ({ value: i + 1, label: m }))} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
          <Select options={yearOptions} value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </div>
      </div>

      {loading || !data ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SummaryCard icon={Wheat} title="Total Besan Produced" value={data.totals.production.totalBesanKg} unit="kg" accent="mustard" />
            <SummaryCard icon={Layers} title="Total Jada Besan" value={data.totals.production.jadaBesanKg} unit="kg" accent="mustard" />
            <SummaryCard icon={Scissors} title="Total Chunni" value={data.totals.production.chunniKg} unit="kg" accent="mustard" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCard icon={IndianRupee} title="Total Sales (Money In)" value={data.totals.totalSales} format={formatCurrency} accent="leaf" />
            <SummaryCard icon={DollarSign} title="Total Expenses" value={data.totals.totalDailyExpenses} format={formatCurrency} accent="brick" />
          </div>

          <Card className="p-5">
            <h3 className="font-display font-semibold mb-4">Daily Production (Besan, kg)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.dailyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EADFC0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(8)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatKg(v)} />
                <Bar dataKey="totalBesanKg" fill="#C08A2E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <h3 className="font-display font-semibold mb-4">Daily Sales vs Expenses Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.dailyBreakdown.map((d) => ({ ...d, expenses: d.workerPayments + d.otherPayments + d.rawMaterials + d.bills }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EADFC0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(8)} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="sales" name="Sales" stroke="#4C6B3F" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#A8492F" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold mb-4">Expense Category Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={data.expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => e.name}>
                    {data.expenseByCategory.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="font-display font-semibold mb-4">Monthly Production Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EADFC0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(8)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatKg(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="totalBesanKg" name="Besan" stroke="#C08A2E" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="jadaBesanKg" name="Jada Besan" stroke="#7A5619" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="chunniKg" name="Chunni" stroke="#4C6B3F" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}