import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-mustard-500 hover:bg-mustard-600 text-white shadow-card",
  secondary: "bg-white hover:bg-wheat-100 text-ink-900 border border-wheat-200",
  danger: "bg-brick-500 hover:bg-brick-600 text-white",
  ghost: "hover:bg-wheat-100 text-ink-800",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}
