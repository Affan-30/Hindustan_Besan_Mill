import { Loader2 } from "lucide-react";

export default function Spinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-10 ${className}`}>
      <Loader2 className="animate-spin text-mustard-500" size={28} />
    </div>
  );
}
