import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wheat, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/app");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wheat-50 px-4">
      <Card className="w-full max-w-sm p-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-800/50 hover:text-mustard-600 mb-4">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-mustard-500 flex items-center justify-center text-white mb-3">
            <Wheat size={28} />
          </div>
          <h1 className="font-display font-semibold text-xl text-ink-900">Hindustan Besan Mill</h1>
          <p className="text-sm text-ink-800/60">Sign in to manage today's mill records</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@hindustanbesanmill.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          {error && <p className="text-sm text-brick-600">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

       
      </Card>
    </div>
  );
}