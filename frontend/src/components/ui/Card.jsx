export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-white rounded-xl border border-wheat-200 shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}
