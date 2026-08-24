import { useEffect, useState } from "react";
import { ProductionAPI } from "../services/resources.js";
import { formatKg, todayISODate, formatDateShort } from "../utils/format.js";
import { DAL_CATEGORIES, computeProductionKg } from "../utils/productionUnits.js";
import { getErrorMessage } from "../services/api.js";
import { useToast } from "../context/ToastContext.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Button from "../components/ui/Button.jsx";
import DataTable from "../components/DataTable.jsx";
import { useCrudList } from "../hooks/useCrudList.js";

const emptyForm = {
  dalCategory: "",
  besanBags10Kg: "",
  besanBags30Kg: "",
  jadaBesanBags50Kg: "",
  chunniBags50Kg: "",
  notes: "",
};

export default function Production() {
  const [date, setDate] = useState(todayISODate());
  const [entriesForDate, setEntriesForDate] = useState([]); // both dal-category entries for the selected date
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const { showToast } = useToast();
  const list = useCrudList(ProductionAPI, { limit: 15 });

  const loadEntriesForDate = () => {
    setLoadingExisting(true);
    return ProductionAPI.byDate(date)
      .then((res) => setEntriesForDate(res.data || []))
      .catch((err) => showToast(getErrorMessage(err), "error"))
      .finally(() => setLoadingExisting(false));
  };

  useEffect(() => {
    setForm(emptyForm);
    loadEntriesForDate();
  }, [date]);

  // When a dal category is picked, load that category's existing entry for
  // this date (if any) so the form edits it; otherwise start fresh for that category.
  const onDalCategoryChange = (dalCategory) => {
    const existing = entriesForDate.find((e) => e.dalCategory === dalCategory);
    if (existing) {
      const { besanBags10Kg, besanBags30Kg, jadaBesanBags50Kg, chunniBags50Kg, notes } = existing;
      setForm({ dalCategory, besanBags10Kg, besanBags30Kg, jadaBesanBags50Kg, chunniBags50Kg, notes: notes || "" });
    } else {
      setForm({ ...emptyForm, dalCategory });
    }
  };

  const kg = computeProductionKg(form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.dalCategory) return showToast("Please select a dal category.", "error");
    const vals = [form.besanBags10Kg, form.besanBags30Kg, form.jadaBesanBags50Kg, form.chunniBags50Kg];
    if (vals.some((v) => Number(v) < 0)) return showToast("Bag counts cannot be negative.", "error");
    setSaving(true);
    try {
      await ProductionAPI.save({ date, ...form });
      showToast("Production saved successfully.");
      await loadEntriesForDate();
      list.reload();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Production</h1>
        <p className="text-ink-800/60 text-sm">
          Record daily production by dal category and bag count. Besan is packed in 10kg and 30kg bags;
          Jada Besan and Chunni in 50kg bags. Each date can have <strong>one entry per dal category</strong> —
          e.g. a Chana Dal entry and a separate Watana Dal entry for the same day. Saving again for the same
          date and category updates that entry.
        </p>
      </div>

      <Card className="p-5 sm:p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            <Select
              label="Dal Category"
              required
              placeholder="Select dal category"
              options={DAL_CATEGORIES}
              value={form.dalCategory}
              onChange={(e) => onDalCategoryChange(e.target.value)}
            />
          </div>

          {entriesForDate.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entriesForDate.map((e) => (
                <button
                  type="button"
                  key={e._id}
                  onClick={() => onDalCategoryChange(e.dalCategory)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    form.dalCategory === e.dalCategory
                      ? "bg-mustard-500 text-white border-mustard-500"
                      : "bg-wheat-100 text-ink-800 border-wheat-200 hover:bg-wheat-200"
                  }`}
                >
                  {e.dalCategory} already recorded — {formatKg(e.totalBesanKg)} besan
                </button>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-ink-800 mb-2">Besan Bags</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="10 kg bags"
                type="number"
                min="0"
                value={form.besanBags10Kg}
                onChange={(e) => setForm({ ...form, besanBags10Kg: e.target.value })}
              />
              <Input
                label="30 kg bags"
                type="number"
                min="0"
                value={form.besanBags30Kg}
                onChange={(e) => setForm({ ...form, besanBags30Kg: e.target.value })}
              />
            </div>
            <p className="text-xs text-ink-800/50 mt-1.5">Total Besan: {formatKg(kg.totalBesanKg)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Jada Besan — 50 kg bags"
                type="number"
                min="0"
                value={form.jadaBesanBags50Kg}
                onChange={(e) => setForm({ ...form, jadaBesanBags50Kg: e.target.value })}
              />
              <p className="text-xs text-ink-800/50 mt-1.5">{formatKg(kg.jadaBesanKg)}</p>
            </div>
            <div>
              <Input
                label="Chunni — 50 kg bags"
                type="number"
                min="0"
                value={form.chunniBags50Kg}
                onChange={(e) => setForm({ ...form, chunniBags50Kg: e.target.value })}
              />
              <p className="text-xs text-ink-800/50 mt-1.5">{formatKg(kg.chunniKg)}</p>
            </div>
          </div>

          <Input label="Notes" placeholder="Optional notes for the day" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button type="submit" loading={saving || loadingExisting}>Save Production</Button>
        </form>
      </Card>

      <div>
        <p className="text-sm font-semibold text-ink-800/70 mb-3">Recent Production Records</p>
        <DataTable
          loading={list.loading}
          rows={list.rows}
          page={list.page}
          pages={list.pages}
          onPageChange={list.setPage}
          emptyMessage="No production recorded yet."
          columns={[
            { key: "date", label: "Date", render: (r) => formatDateShort(r.date) },
            { key: "dalCategory", label: "Dal" },
            { key: "besan", label: "Besan Bags", render: (r) => `${r.besanBags10Kg || 0} × 10kg, ${r.besanBags30Kg || 0} × 30kg` },
            { key: "totalBesanKg", label: "Besan", render: (r) => formatKg(r.totalBesanKg) },
            { key: "jadaBesanKg", label: "Jada Besan", render: (r) => `${r.jadaBesanBags50Kg || 0} × 50kg (${formatKg(r.jadaBesanKg)})` },
            { key: "chunniKg", label: "Chunni", render: (r) => `${r.chunniBags50Kg || 0} × 50kg (${formatKg(r.chunniKg)})` },
            { key: "notes", label: "Notes" },
          ]}
        />
      </div>
    </div>
  );
}