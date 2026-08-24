export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink-800 mb-1">{label}</span>}
      <input
        className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-mustard-400 ${
          error ? "border-brick-500" : "border-wheat-200"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-brick-600 mt-1 block">{error}</span>}
    </label>
  );
}
