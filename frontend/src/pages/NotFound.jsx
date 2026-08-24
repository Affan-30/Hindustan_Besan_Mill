import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotFound() {
  const { user } = useAuth();
  const target = user ? "/app" : "/";
  const label = user ? "Go to Dashboard" : "Go to Home";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-2">Page not found</h1>
      <p className="text-ink-800/60 mb-6">The page you're looking for doesn't exist.</p>
      <Link to={target} className="text-mustard-600 font-semibold hover:text-mustard-700">
        {label}
      </Link>
    </div>
  );
}