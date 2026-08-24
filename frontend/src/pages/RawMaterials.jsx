import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { RawMaterialsAPI, SuppliersAPI } from "../services/resources.js";
import { useCrudList } from "../hooks/useCrudList.js";
import { formatCurrency, formatDateShort, todayISODate } from "../utils/format.js";
import { getErrorMessage } from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";

const MATERIALS = ["Chana Dal", "Watana Dal", "Other"];
const UNITS = ["Kg", "Quintal", "Ton"];
const METHODS = ["Cash", "UPI", "Bank Transfer"];
const STATUSES = ["Paid", "Partially Paid", "Credit"];

const emptyForm = {
  date: todayISODate(), material: "", supplierId: "", quantity: "", unit: "Kg", rate: "",
  paymentStatus: "Paid", paidAmount: "", paymentMethod: "Cash", invoiceNumber: "", notes: "",
};

export default function RawMaterials() {
  const list = useCrudList(RawMaterialsAPI);
  const { showToast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    SuppliersAPI.list({ status: "Active", limit: 200 }).then((res) => setSuppliers(res.data)).catch(() => {});
  }, []);

  const total = (Number(form.quantity) || 0) * (Number(form.rate) || 0);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ ...row, date: row.date.slice(0, 10), supplierId: row.supplierId?._id || row.supplierId });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.quantity) < 0 || Number(form.rate) < 0) return showToast("Quantity and rate cannot be negative.", "error");
    setSaving(true);
    try {
      if (editing) await list.update(editing._id, form);
      else await list.create(form);
      setModalOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await list.remove(deleteTarget._id);
      setDeleteTarget(null);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Raw Material Purchases</h1>
          <p className="text-ink-800/60 text-sm">Chana dal, watana dal and other raw material purchases.</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add Purchase</Button>
      </div>

      <DataTable
        loading={list.loading}
        rows={list.rows}
        search={list.search}
        onSearchChange={list.setSearch}
        page={list.page}
        pages={list.pages}
        onPageChange={list.setPage}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        emptyMessage="No raw material purchases recorded yet."
        columns={[
          { key: "date", label: "Date", render: (r) => formatDateShort(r.date) },
          { key: "material", label: "Material" },
          { key: "supplierNameSnapshot", label: "Supplier" },
          { key: "quantity", label: "Qty", render: (r) => `${r.quantity} ${r.unit}` },
          { key: "rate", label: "Rate", render: (r) => formatCurrency(r.rate) },
          { key: "totalAmount", label: "Total", render: (r) => formatCurrency(r.totalAmount) },
          { key: "paymentStatus", label: "Status" },
        ]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Purchase" : "Add Raw Material Purchase"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>{editing ? "Update" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Select label="Material" required options={MATERIALS} placeholder="Select material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
          <Select
            label="Supplier"
            required
            placeholder="Select supplier"
            options={suppliers.map((s) => ({ value: s._id, label: s.name }))}
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantity" type="number" min="0" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <Select label="Unit" options={UNITS} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
          <Input label="Rate (₹ per unit)" type="number" min="0" required value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
          <div className="bg-wheat-100 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-900">
            Total Amount: {formatCurrency(total)}
          </div>
          <Select label="Payment Status" options={STATUSES} value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })} />
          {form.paymentStatus === "Partially Paid" && (
            <Input label="Paid Amount (₹)" type="number" min="0" max={total} value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} />
          )}
          <Select label="Payment Method" options={METHODS} value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
          <Input label="Invoice/Bill Number" value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
