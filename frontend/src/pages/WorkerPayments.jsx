import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { WorkerPaymentsAPI, WorkersAPI } from "../services/resources.js";
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

const TYPES = ["Daily Wage", "Advance", "Overtime", "Other"];
const METHODS = ["Cash", "UPI", "Bank Transfer"];

const emptyForm = { date: todayISODate(), workerId: "", amount: "", paymentType: "Daily Wage", paymentMethod: "Cash", description: "", notes: "" };

export default function WorkerPayments() {
  const list = useCrudList(WorkerPaymentsAPI);
  const { showToast } = useToast();
  const [workers, setWorkers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    WorkersAPI.list({ status: "Active", limit: 200 }).then((res) => setWorkers(res.data)).catch(() => {});
  }, []);

  const onWorkerChange = (workerId) => {
    const w = workers.find((x) => x._id === workerId);
    setForm({ ...form, workerId, amount: w ? String(w.dailyWage) : form.amount });
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ ...row, date: row.date.slice(0, 10), workerId: row.workerId?._id || row.workerId });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.amount) < 0) return showToast("Amount cannot be negative.", "error");
    if (!form.workerId) return showToast("Please select a worker.", "error");
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
          <h1 className="font-display text-2xl font-semibold text-ink-900">Worker Payments</h1>
          <p className="text-ink-800/60 text-sm">Daily wages, advances and overtime payments to workers.</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add Worker Payment</Button>
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
        emptyMessage="No worker payments recorded yet."
        columns={[
          { key: "date", label: "Date", render: (r) => formatDateShort(r.date) },
          { key: "workerNameSnapshot", label: "Worker" },
          { key: "paymentType", label: "Type" },
          { key: "notes", label: "Notes" },
          { key: "paymentMethod", label: "Method" },
          { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount) },
        ]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Worker Payment" : "Add Worker Payment"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>{editing ? "Update" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Select
            label="Worker"
            required
            placeholder="Select worker"
            options={workers.map((w) => ({ value: w._id, label: w.name }))}
            value={form.workerId}
            onChange={(e) => onWorkerChange(e.target.value)}
          />
          <Input label="Amount (₹)" type="number" min="0" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Select label="Payment Type" options={TYPES} value={form.paymentType} onChange={(e) => setForm({ ...form, paymentType: e.target.value })} />
          <Select label="Payment Method" options={METHODS} value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
