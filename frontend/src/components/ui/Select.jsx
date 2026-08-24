export default function Select({ label, error, options = [], className = "", placeholder, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink-800 mb-1">{label}</span>}
      <select
        className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-mustard-400 ${
          error ? "border-brick-500" : "border-wheat-200"
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-brick-600 mt-1 block">{error}</span>}
    </label>
  );
}
