import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink-900/40 p-0 sm:p-4 no-print">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-2xl max-h-[92vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-wheat-200 sticky top-0 bg-white z-10">
          <h3 className="font-display font-semibold text-lg text-ink-900">{title}</h3>
          <button onClick={onClose} className="text-ink-800 hover:text-brick-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-wheat-200 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
