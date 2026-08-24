import { Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "./ui/EmptyState.jsx";
import Card from "./ui/Card.jsx";

// Generic table shell: columns = [{ key, label, render? }]
export default function DataTable({
  columns,
  rows,
  loading,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  emptyMessage = "No records found.",
  page,
  pages,
  onPageChange,
  extraFilters,
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-wheat-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {onSearchChange && (
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/40" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-wheat-200 focus:outline-none focus:ring-2 focus:ring-mustard-400"
            />
          </div>
        )}
        {extraFilters && <div className="flex gap-2 flex-wrap">{extraFilters}</div>}
      </div>

      {loading ? (
        <div className="p-10 text-center text-ink-800/50 text-sm">Loading...</div>
      ) : rows.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-wheat-100/60 text-left">
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 font-semibold text-ink-800/70 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  {(onEdit || onDelete) && <th className="px-4 py-3"></th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-t border-wheat-100 hover:bg-wheat-50/60">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1">
                          {onEdit && (
                            <button onClick={() => onEdit(row)} className="p-1.5 text-ink-800/60 hover:text-mustard-600">
                              <Pencil size={16} />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(row)} className="p-1.5 text-ink-800/60 hover:text-brick-600">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-wheat-200">
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded disabled:opacity-30 text-ink-800 hover:bg-wheat-100"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs text-ink-800/60">Page {page} of {pages}</span>
              <button
                disabled={page >= pages}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded disabled:opacity-30 text-ink-800 hover:bg-wheat-100"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
