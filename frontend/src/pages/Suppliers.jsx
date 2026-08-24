import { useState } from "react";
import { Plus, History } from "lucide-react";
import { SuppliersAPI } from "../services/resources.js";
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

const emptyForm = { name: "", mobile: "", address: "", gstNumber: "", materialsSupplied: "", status: "Active", notes: "" };

export default function Suppliers() {
  const list = useCrudList(SuppliersAPI, { limit: 100 });
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [historySupplier, setHistorySupplier] = useState(null);
  const [history, setHistory] = useState(null);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm(row); setModalOpen(true); };

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

  const openHistory = async (supplier) => {
    setHistorySupplier(supplier);
    setHistory(null);
    try {
      const res = await SuppliersAPI.history(supplier._id);
      setHistory(res);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Suppliers</h1>
          <p className="text-ink-800/60 text-sm">Raw material suppliers and their purchase history.</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add Supplier</Button>
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
        emptyMessage="No suppliers added yet."
        columns={[
          { key: "name", label: "Name" },
          { key: "materialsSupplied", label: "Materials" },
          { key: "mobile", label: "Mobile" },
          { key: "status", label: "Status", render: (r) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.status === "Active" ? "bg-leaf-500/10 text-leaf-600" : "bg-ink-800/10 text-ink-800/60"}`}>
              {r.status}
            </span>
          )},
          { key: "actions2", label: "", render: (r) => (
            <div className="flex gap-2">
              <button onClick={() => openHistory(r)} className="p-1.5 text-ink-800/60 hover:text-mustard-600" title="Purchase history">
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
        title={editing ? "Edit Supplier" : "Add Supplier"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>{editing ? "Update" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Supplier Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} />
          <Input label="Materials Supplied" placeholder="e.g. Chana Dal" value={form.materialsSupplied} onChange={(e) => setForm({ ...form, materialsSupplied: e.target.value })} />
          <Select label="Status" options={["Active", "Inactive"]} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </form>
      </Modal>

      <Modal open={!!historySupplier} onClose={() => setHistorySupplier(null)} title={`Purchase History — ${historySupplier?.name || ""}`}>
        {!history ? (
          <Spinner />
        ) : history.data.length === 0 ? (
          <EmptyState message="No purchases recorded for this supplier yet." />
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-wheat-100 rounded-lg p-3">
                <p className="text-xs text-ink-800/60">Total Purchases</p>
                <p className="font-semibold">{formatCurrency(history.totalPurchases)}</p>
              </div>
              <div className="bg-leaf-500/10 rounded-lg p-3">
                <p className="text-xs text-ink-800/60">Total Paid</p>
                <p className="font-semibold">{formatCurrency(history.totalPaid)}</p>
              </div>
              <div className="bg-brick-500/10 rounded-lg p-3">
                <p className="text-xs text-ink-800/60">Total Credit</p>
                <p className="font-semibold">{formatCurrency(history.totalCredit)}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-800/60">
                    <th className="py-1.5 pr-3">Date</th>
                    <th className="py-1.5 pr-3">Material</th>
                    <th className="py-1.5 pr-3">Qty</th>
                    <th className="py-1.5">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {history.data.map((p) => (
                    <tr key={p._id} className="border-t border-wheat-100">
                      <td className="py-1.5 pr-3">{formatDateShort(p.date)}</td>
                      <td className="py-1.5 pr-3">{p.material}</td>
                      <td className="py-1.5 pr-3">{p.quantity} {p.unit}</td>
                      <td className="py-1.5">{formatCurrency(p.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} message="Are you sure you want to delete this supplier?" />
    </div>
  );
}
