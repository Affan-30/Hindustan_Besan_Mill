import { Inbox } from "lucide-react";

export default function EmptyState({ message, actionLabel, onAction, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Icon size={32} className="text-wheat-300 mb-3" />
      <p className="text-sm text-ink-800/70 mb-4">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-sm font-semibold text-mustard-600 hover:text-mustard-700">
          + {actionLabel}
        </button>
      )}
    </div>
  );
}
