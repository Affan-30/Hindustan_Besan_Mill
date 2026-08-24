import { useState } from "react";
import { Plus, History } from "lucide-react";
import { WorkersAPI } from "../services/resources.js";
import { useCrudList } from "../hooks/useCrudList.js";
import { formatCurrency, formatDateShort } from "../utils/format.js";
import { getErrorMessage } from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";
import DataTable from "../components/DataTable.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const emptyForm = { name: "", mobile: "", dailyWage: "", joiningDate: "", status: "Active", notes: "" };

export default function Workers() {
  const list = useCrudList(WorkersAPI, { limit: 100 });
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [historyWorker, setHistoryWorker] = useState(null);
  const [history, setHistory] = useState(null);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ ...row, joiningDate: row.joiningDate ? row.joiningDate.slice(0, 10) : "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const openHistory = async (worker) => {
    setHistoryWorker(worker);
    setHistory(null);
    try {
      const res = await WorkersAPI.history(worker._id);
      setHistory(res);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Workers</h1>
          <p className="text-ink-800/60 text-sm">Manage your worker master list and view payment history.</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add Worker</Button>
      </div>

      <DataTable
        loading={list.loading}
        rows={list.rows}
        search={list.search}
        onSearchChange={list.setSearch}
        page={list.page}
        pages={list.pages}
        onPageChange={list.setPage}
        onDelete={setDeleteTarget}
        emptyMessage="No workers added yet."
        columns={[
          { key: "name", label: "Name" },
          { key: "mobile", label: "Mobile" },
          { key: "dailyWage", label: "Daily Wage", render: (r) => formatCurrency(r.dailyWage) },
          { key: "status", label: "Status", render: (r) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status === "Active" ? "bg-leaf-500/10 text-leaf-600" : "bg-ink-800/10 text-ink-800/60"}`}>
              {r.status}
            </span>
          )},
          { key: "actions2", label: "", render: (r) => (
            <div className="flex gap-2">
              <button onClick={() => openHistory(r)} className="p-1.5 text-ink-800/60 hover:text-mustard-600" title="Payment history">
                <History size={16} />
              </button>
              <button onClick={() => openEdit(r)} className="text-xs font-semibold text-mustard-600 hover:text-mustard-700">Edit</button>
            </div>
          )},
        ]}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Worker" : "Add Worker"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>{editing ? "Update" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Worker Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          <Input label="Daily Wage (₹)" type="number" min="0" value={form.dailyWage} onChange={(e) => setForm({ ...form, dailyWage: e.target.value })} />
          <Input label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
          <Select label="Status" options={["Active", "Inactive"]} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </form>
      </Modal>

      <Modal open={!!historyWorker} onClose={() => setHistoryWorker(null)} title={`Payment History — ${historyWorker?.name || ""}`}>
        {!history ? (
          <Spinner />
        ) : history.data.length === 0 ? (
          <EmptyState message="No payments recorded for this worker yet." />
        ) : (
          <div className="space-y-3">
            <div className="bg-wheat-100 rounded-lg p-3 text-sm font-semibold text-ink-900">
              Total Paid: {formatCurrency(history.totalPaid)}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-800/60">
                    <th className="py-1.5 pr-3">Date</th>
                    <th className="py-1.5 pr-3">Type</th>
                    <th className="py-1.5 pr-3">Amount</th>
                    <th className="py-1.5">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {history.data.map((p) => (
                    <tr key={p._id} className="border-t border-wheat-100">
                      <td className="py-1.5 pr-3">{formatDateShort(p.date)}</td>
                      <td className="py-1.5 pr-3">{p.paymentType}</td>
                      <td className="py-1.5 pr-3">{formatCurrency(p.amount)}</td>
                      <td className="py-1.5">{p.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message="Are you sure you want to delete this worker?" />
    </div>
  );
}
