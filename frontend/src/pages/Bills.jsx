import { useState } from "react";
import { Plus } from "lucide-react";
import { BillsAPI } from "../services/resources.js";
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

const BILL_TYPES = ["Electricity", "Water", "Rent", "Internet", "Telephone", "GST/Tax", "Machinery", "Insurance", "Other"];
const METHODS = ["Cash", "UPI", "Bank Transfer"];

const emptyForm = { date: todayISODate(), billType: "", description: "", amount: "", billingPeriod: "", paymentMethod: "Cash", billNumber: "", paidTo: "", notes: "" };

export default function Bills() {
  const list = useCrudList(BillsAPI);
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm({ ...row, date: row.date.slice(0, 10) }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.amount) < 0) return showToast("Amount cannot be negative.", "error");
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
          <h1 className="font-display text-2xl font-semibold text-ink-900">Bill Payments</h1>
          <p className="text-ink-800/60 text-sm">Recurring business bills — electricity, rent, water and more.</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add Bill</Button>
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
        emptyMessage="No bills recorded yet."
        columns={[
          { key: "date", label: "Date", render: (r) => formatDateShort(r.date) },
          { key: "billType", label: "Bill Type" },
          { key: "billingPeriod", label: "Period" },
          { key: "paymentMethod", label: "Method" },
          { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
        ]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Bill" : "Add Bill"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>{editing ? "Update" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Select label="Bill Type" required options={BILL_TYPES} placeholder="Select bill type" value={form.billType} onChange={(e) => setForm({ ...form, billType: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Amount (₹)" type="number" min="0" step="0.01" required inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input label="Billing Period" placeholder="e.g. August 2026" value={form.billingPeriod} onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })} />
          <Select label="Payment Method" options={METHODS} value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
          <Input label="Bill Number" value={form.billNumber} onChange={(e) => setForm({ ...form, billNumber: e.target.value })} />
          <Input label="Paid To" value={form.paidTo} onChange={(e) => setForm({ ...form, paidTo: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
