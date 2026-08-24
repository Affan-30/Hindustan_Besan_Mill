import { useState } from "react";
import { Plus } from "lucide-react";
import { SalesAPI } from "../services/resources.js";
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

const METHODS = ["Cash", "UPI", "Bank Transfer"];

const emptyForm = { date: todayISODate(), partyName: "", amount: "", paymentMethod: "Cash", referenceNumber: "", description: "", notes: "" };

export default function Sales() {
  const list = useCrudList(SalesAPI);
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
    if (!form.partyName) return showToast("Party name is required.", "error");
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
          <h1 className="font-display text-2xl font-semibold text-ink-900">Payment Received</h1>
          <p className="text-ink-800/60 text-sm">Money coming in — payments received from parties/customers for goods sold.</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add Payment Received</Button>
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
        emptyMessage="No payments received recorded yet."
        columns={[
          { key: "date", label: "Date", render: (r) => formatDateShort(r.date) },
          { key: "partyName", label: "Party" },
          { key: "referenceNumber", label: "Reference No." },
          { key: "paymentMethod", label: "Method" },
          { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
        ]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Payment Received" : "Add Payment Received"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>{editing ? "Update" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Party Name" required placeholder="Who paid you" value={form.partyName} onChange={(e) => setForm({ ...form, partyName: e.target.value })} />
          <Input label="Amount (₹)" type="number" min="0" step="0.01" required inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Select label="Payment Method" options={METHODS} value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
          <Input label="Reference/Bill Number" value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}