import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "./ui/Card.jsx";

export default function SummaryCard({ icon: Icon, title, value, unit, previous, accent = "mustard", format, subtitle }) {
  const hasComparison = previous !== undefined && previous !== null;
  const diff = hasComparison ? value - previous : 0;
  const pct = hasComparison && previous !== 0 ? Math.round((diff / previous) * 100) : null;

  const accentClasses = {
    mustard: "bg-mustard-500/10 text-mustard-600",
    leaf: "bg-leaf-500/10 text-leaf-600",
    brick: "bg-brick-500/10 text-brick-600",
    ink: "bg-ink-800/10 text-ink-800",
  };

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}>
          <Icon size={20} />
        </div>
        {hasComparison && pct !== null && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded ${
              diff >= 0 ? "text-leaf-600 bg-leaf-500/10" : "text-brick-600 bg-brick-500/10"
            }`}
          >
            {diff >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(pct)}%
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-ink-800/60 mb-1">{title}</p>
      <p className="font-display text-2xl font-semibold text-ink-900">
        {format ? format(value) : value}
        {unit && <span className="text-sm font-body font-normal text-ink-800/50 ml-1">{unit}</span>}
      </p>
      {subtitle && <p className="text-xs text-ink-800/50 mt-1">{subtitle}</p>}
    </Card>
  );
}