import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wheat, Banknote, Receipt, Package, FileBarChart, FileText, Download, IndianRupee } from "lucide-react";
import {
  ProductionAPI, WorkerPaymentsAPI, OtherPaymentsAPI, RawMaterialsAPI, BillsAPI, SalesAPI,
  WorkersAPI, SuppliersAPI, DashboardAPI,
} from "../services/resources.js";
import { formatCurrency, formatKg, todayISODate, formatDateDisplay } from "../utils/format.js";
import { DAL_CATEGORIES, computeProductionKg } from "../utils/productionUnits.js";
import { getErrorMessage } from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Button from "../components/ui/Button.jsx";

const CATEGORIES = ["Transport", "Diesel", "Fuel", "Repair", "Maintenance", "Packaging",
  "Loading/Unloading", "Tea/Food", "Office Expense", "Miscellaneous", "Other"];
const BILL_TYPES = ["Electricity", "Water", "Rent", "Internet", "Telephone", "GST/Tax", "Machinery", "Insurance", "Other"];
const MATERIALS = ["Chana Dal", "Watana Dal", "Other"];
const METHODS = ["Cash", "UPI", "Bank Transfer"];

export default function DailyEntry() {
  const date = todayISODate();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [prodForm, setProdForm] = useState({
    dalCategory: "", besanBags10Kg: "", besanBags30Kg: "", jadaBesanBags50Kg: "", chunniBags50Kg: "",
  });
  const [wpForm, setWpForm] = useState({ workerId: "", amount: "", paymentType: "Daily Wage", paymentMethod: "Cash" });
  const [opForm, setOpForm] = useState({ category: "", description: "", amount: "" });
  const [rmForm, setRmForm] = useState({ material: "", supplierId: "", quantity: "", unit: "Kg", rate: "" });
  const [billForm, setBillForm] = useState({ billType: "", amount: "" });
  const [saleForm, setSaleForm] = useState({ partyName: "", amount: "", paymentMethod: "Cash", referenceNumber: "" });

  const [saving, setSaving] = useState({});

  const loadSummary = () => {
    setLoadingSummary(true);
    DashboardAPI.daily(date)
      .then((res) => setSummary(res.data))
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => setLoadingSummary(false));
  };

  useEffect(() => {
    WorkersAPI.list({ status: "Active", limit: 200 }).then((r) => setWorkers(r.data)).catch(() => {});
    SuppliersAPI.list({ status: "Active", limit: 200 }).then((r) => setSuppliers(r.data)).catch(() => {});
    loadSummary();
  }, []);

  const setSavingKey = (key, val) => setSaving((s) => ({ ...s, [key]: val }));

  const saveProduction = async (e) => {
    e.preventDefault();
    if (!prodForm.dalCategory) return showToast("Please select a dal category.", "error");
    if ([prodForm.besanBags10Kg, prodForm.besanBags30Kg, prodForm.jadaBesanBags50Kg, prodForm.chunniBags50Kg].some((v) => Number(v) < 0)) {
      return showToast("Bag counts cannot be negative.", "error");
    }
    setSavingKey("prod", true);
    try {
      await ProductionAPI.save({ date, ...prodForm });
      showToast("Production saved successfully.");
      setProdForm({ dalCategory: "", besanBags10Kg: "", besanBags30Kg: "", jadaBesanBags50Kg: "", chunniBags50Kg: "" });
      loadSummary();
    } catch (err) { showToast(getErrorMessage(err), "error"); } finally { setSavingKey("prod", false); }
  };

  const saveWorkerPayment = async (e) => {
    e.preventDefault();
    if (!wpForm.workerId) return showToast("Please select a worker.", "error");
    if (Number(wpForm.amount) < 0) return showToast("Amount cannot be negative.", "error");
    setSavingKey("wp", true);
    try {
      await WorkerPaymentsAPI.create({ date, ...wpForm });
      showToast("Worker payment added.");
      setWpForm({ workerId: "", amount: "", paymentType: "Daily Wage", paymentMethod: "Cash" });
      loadSummary();
    } catch (err) { showToast(getErrorMessage(err), "error"); } finally { setSavingKey("wp", false); }
  };

  const saveOtherPayment = async (e) => {
    e.preventDefault();
    if (!opForm.category) return showToast("Please select a category.", "error");
    if (Number(opForm.amount) < 0) return showToast("Amount cannot be negative.", "error");
    setSavingKey("op", true);
    try {
      await OtherPaymentsAPI.create({ date, ...opForm });
      showToast("Payment added.");
      setOpForm({ category: "", description: "", amount: "" });
      loadSummary();
    } catch (err) { showToast(getErrorMessage(err), "error"); } finally { setSavingKey("op", false); }
  };

  const saveRawMaterial = async (e) => {
    e.preventDefault();
    if (!rmForm.material || !rmForm.supplierId) return showToast("Material and supplier are required.", "error");
    if (Number(rmForm.quantity) < 0 || Number(rmForm.rate) < 0) return showToast("Quantity and rate cannot be negative.", "error");
    setSavingKey("rm", true);
    try {
      await RawMaterialsAPI.create({ date, paymentStatus: "Paid", paymentMethod: "Cash", ...rmForm });
      showToast("Raw material purchase recorded.");
      setRmForm({ material: "", supplierId: "", quantity: "", unit: "Kg", rate: "" });
      loadSummary();
    } catch (err) { showToast(getErrorMessage(err), "error"); } finally { setSavingKey("rm", false); }
  };

  const saveBill = async (e) => {
    e.preventDefault();
    if (!billForm.billType) return showToast("Please select a bill type.", "error");
    if (Number(billForm.amount) < 0) return showToast("Amount cannot be negative.", "error");
    setSavingKey("bill", true);
    try {
      await BillsAPI.create({ date, paymentMethod: "Cash", ...billForm });
      showToast("Bill payment added.");
      setBillForm({ billType: "", amount: "" });
      loadSummary();
    } catch (err) { showToast(getErrorMessage(err), "error"); } finally { setSavingKey("bill", false); }
  };

  const saveSale = async (e) => {
    e.preventDefault();
    if (!saleForm.partyName) return showToast("Party name is required.", "error");
    if (Number(saleForm.amount) < 0) return showToast("Amount cannot be negative.", "error");
    setSavingKey("sale", true);
    try {
      await SalesAPI.create({ date, ...saleForm });
      showToast("Payment received recorded.");
      setSaleForm({ partyName: "", amount: "", paymentMethod: "Cash", referenceNumber: "" });
      loadSummary();
    } catch (err) { showToast(getErrorMessage(err), "error"); } finally { setSavingKey("sale", false); }
  };

  const rmTotal = (Number(rmForm.quantity) || 0) * (Number(rmForm.rate) || 0);
  const totals = summary?.totals || {};
  const production = totals.production || {};

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Daily Entry</h1>
        <p className="text-ink-800/60 text-sm">{formatDateDisplay(date)} — enter everything for today from one screen.</p>
      </div>

      {/* PRODUCTION */}
      <EntrySection icon={Wheat} title="Production">
        <p className="text-xs text-ink-800/50 mb-3">
          You can add one entry per dal category — save Chana Dal, then pick Watana Dal and save it separately.
        </p>
        <form onSubmit={saveProduction} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <Select
              placeholder="Dal Category"
              options={DAL_CATEGORIES}
              value={prodForm.dalCategory}
              onChange={(e) => setProdForm({ ...prodForm, dalCategory: e.target.value })}
            />
            <Input placeholder="Besan — 10kg bags" type="number" min="0" value={prodForm.besanBags10Kg} onChange={(e) => setProdForm({ ...prodForm, besanBags10Kg: e.target.value })} />
            <Input placeholder="Besan — 30kg bags" type="number" min="0" value={prodForm.besanBags30Kg} onChange={(e) => setProdForm({ ...prodForm, besanBags30Kg: e.target.value })} />
            <Input placeholder="Jada Besan — 50kg bags" type="number" min="0" value={prodForm.jadaBesanBags50Kg} onChange={(e) => setProdForm({ ...prodForm, jadaBesanBags50Kg: e.target.value })} />
            <Input placeholder="Chunni — 50kg bags" type="number" min="0" value={prodForm.chunniBags50Kg} onChange={(e) => setProdForm({ ...prodForm, chunniBags50Kg: e.target.value })} />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-ink-800/50">
              {(() => {
                const kg = computeProductionKg(prodForm);
                return `Besan: ${formatKg(kg.totalBesanKg)} · Jada Besan: ${formatKg(kg.jadaBesanKg)} · Chunni: ${formatKg(kg.chunniKg)}`;
              })()}
            </p>
            <Button type="submit" loading={saving.prod}>Save Production</Button>
          </div>
        </form>
        <div className="mt-4">
          <TodayList
            rows={summary?.production}
            render={(r) => `${r.dalCategory} — Besan: ${formatKg(r.totalBesanKg)} (${r.besanBags10Kg || 0}×10kg, ${r.besanBags30Kg || 0}×30kg), Jada Besan: ${formatKg(r.jadaBesanKg)}, Chunni: ${formatKg(r.chunniKg)}`}
            empty="No production recorded today."
          />
        </div>
      </EntrySection>

      {/* WORKER PAYMENTS */}
      <EntrySection icon={Banknote} title="Worker Payments">
        <form onSubmit={saveWorkerPayment} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end mb-4">
          <Select placeholder="Select Worker" options={workers.map((w) => ({ value: w._id, label: w.name }))} value={wpForm.workerId} onChange={(e) => {
            const w = workers.find((x) => x._id === e.target.value);
            setWpForm({ ...wpForm, workerId: e.target.value, amount: w ? String(w.dailyWage) : wpForm.amount });
          }} />
          <Input placeholder="Amount" type="number" min="0" value={wpForm.amount} onChange={(e) => setWpForm({ ...wpForm, amount: e.target.value })} />
          <Select options={["Daily Wage", "Advance", "Overtime", "Other"]} value={wpForm.paymentType} onChange={(e) => setWpForm({ ...wpForm, paymentType: e.target.value })} />
          <Select options={METHODS} value={wpForm.paymentMethod} onChange={(e) => setWpForm({ ...wpForm, paymentMethod: e.target.value })} />
          <Button type="submit" loading={saving.wp}>Add Payment</Button>
        </form>
        <TodayList rows={summary?.workerPayments} render={(r) => `${r.workerNameSnapshot} — ${formatCurrency(r.amount)} (${r.paymentType})`} empty="No worker payments recorded today." />
      </EntrySection>

      {/* OTHER PAYMENTS */}
      <EntrySection icon={Receipt} title="Other Payments">
        <form onSubmit={saveOtherPayment} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end mb-4">
          <Select placeholder="Select Category" options={CATEGORIES} value={opForm.category} onChange={(e) => setOpForm({ ...opForm, category: e.target.value })} />
          <Input placeholder="Description" value={opForm.description} onChange={(e) => setOpForm({ ...opForm, description: e.target.value })} />
          <Input placeholder="Amount" type="number" min="0" value={opForm.amount} onChange={(e) => setOpForm({ ...opForm, amount: e.target.value })} />
          <Button type="submit" loading={saving.op}>Add Payment</Button>
        </form>
        <TodayList rows={summary?.otherPayments} render={(r) => `${r.category} — ${formatCurrency(r.amount)}`} empty="No other payments recorded today." />
      </EntrySection>

      {/* RAW MATERIAL */}
      <EntrySection icon={Package} title="Raw Material">
        <form onSubmit={saveRawMaterial} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end mb-4">
          <Select placeholder="Material" options={MATERIALS} value={rmForm.material} onChange={(e) => setRmForm({ ...rmForm, material: e.target.value })} />
          <Select placeholder="Supplier" options={suppliers.map((s) => ({ value: s._id, label: s.name }))} value={rmForm.supplierId} onChange={(e) => setRmForm({ ...rmForm, supplierId: e.target.value })} />
          <Input placeholder="Quantity" type="number" min="0" value={rmForm.quantity} onChange={(e) => setRmForm({ ...rmForm, quantity: e.target.value })} />
          <Select options={["Kg", "Quintal", "Ton"]} value={rmForm.unit} onChange={(e) => setRmForm({ ...rmForm, unit: e.target.value })} />
          <Input placeholder="Rate" type="number" min="0" value={rmForm.rate} onChange={(e) => setRmForm({ ...rmForm, rate: e.target.value })} />
          <Button type="submit" loading={saving.rm}>Add Purchase</Button>
        </form>
        <p className="text-xs text-ink-800/50 mb-3">Total: {formatCurrency(rmTotal)}</p>
        <TodayList rows={summary?.rawMaterials} render={(r) => `${r.material} — ${r.quantity} ${r.unit} @ ${formatCurrency(r.rate)} = ${formatCurrency(r.totalAmount)}`} empty="No raw material purchases recorded today." />
      </EntrySection>

      {/* BILLS */}
      <EntrySection icon={FileBarChart} title="Bills">
        <form onSubmit={saveBill} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end mb-4">
          <Select placeholder="Bill Type" options={BILL_TYPES} value={billForm.billType} onChange={(e) => setBillForm({ ...billForm, billType: e.target.value })} />
          <Input placeholder="Amount" type="number" min="0" value={billForm.amount} onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })} />
          <Button type="submit" loading={saving.bill}>Add Bill</Button>
        </form>
        <TodayList rows={summary?.bills} render={(r) => `${r.billType} — ${formatCurrency(r.amount)}`} empty="No bills recorded today." />
      </EntrySection>

      {/* SELL / PAYMENT RECEIVED */}
      <EntrySection icon={IndianRupee} title="Sell (Payment Received)" accent="leaf">
        <p className="text-xs text-ink-800/50 mb-3">Money coming in — record a payment received from a party. Kept separate from expenses.</p>
        <form onSubmit={saveSale} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end mb-4">
          <Input placeholder="Party Name" value={saleForm.partyName} onChange={(e) => setSaleForm({ ...saleForm, partyName: e.target.value })} />
          <Input placeholder="Amount" type="number" min="0" value={saleForm.amount} onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })} />
          <Select options={METHODS} value={saleForm.paymentMethod} onChange={(e) => setSaleForm({ ...saleForm, paymentMethod: e.target.value })} />
          <Input placeholder="Reference No. (optional)" value={saleForm.referenceNumber} onChange={(e) => setSaleForm({ ...saleForm, referenceNumber: e.target.value })} />
          <Button type="submit" loading={saving.sale}>Add Payment Received</Button>
        </form>
        <TodayList rows={summary?.sales} render={(r) => `${r.partyName} — ${formatCurrency(r.amount)} (${r.paymentMethod})`} empty="No payments received recorded today." />
      </EntrySection>

      {/* SUMMARY */}
      <Card className="p-5 sm:p-6 bg-black sm:bg-black border-none">
        <p className="font-display text-lg font-semibold text-white mb-4">Today's Summary</p>
        {loadingSummary ? (
          <p className="text-wheat-100/60 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-white mb-5">
            <SummaryLine label="Production" value={`${formatKg(production.totalBesanKg)}`} />
            <SummaryLine label="Worker Payments" value={formatCurrency(totals.totalWorkerPayments)} />
            <SummaryLine label="Other Payments" value={formatCurrency(totals.totalOtherPayments)} />
            <SummaryLine label="Raw Material" value={formatCurrency(totals.totalRawMaterialPurchases)} />
            <SummaryLine label="Bills" value={formatCurrency(totals.totalBillPayments)} />
            <SummaryLine label="TOTAL EXPENSE" value={formatCurrency(totals.totalDailyExpenses)} highlight />
            <SummaryLine label="Sales (Payment Received)" value={formatCurrency(totals.totalSales)} sales />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={FileText} onClick={() => navigate("/app/reports/daily")}>View Full Report</Button>
          <Button icon={Download} onClick={() => navigate("/app/reports/daily")}>Export PDF</Button>
        </div>
      </Card>
    </div>
  );
}

const EntrySection = ({ icon: Icon, title, children, accent = "mustard" }) => (
  <Card className="p-5 sm:p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon size={18} className={accent === "leaf" ? "text-leaf-600" : "text-mustard-600"} />
      <h2 className="font-display font-semibold text-ink-900">{title}</h2>
    </div>
    {children}
  </Card>
);

const TodayList = ({ rows, render, empty }) => {
  if (!rows || rows.length === 0) return <p className="text-sm text-ink-800/50 italic">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r._id} className="text-sm text-ink-800 bg-wheat-50 rounded-lg px-3 py-2">{render(r)}</li>
      ))}
    </ul>
  );
};

const SummaryLine = ({ label, value, highlight, sales }) => (
  <div>
    <p className="text-xs text-wheat-100/60">{label}</p>
    <p className={`font-display font-semibold ${highlight ? "text-mustard-400 text-xl" : sales ? "text-leaf-400 text-xl" : "text-white"}`}>{value}</p>
  </div>
);