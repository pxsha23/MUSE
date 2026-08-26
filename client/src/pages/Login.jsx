import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="font-display text-center text-3xl font-bold text-ink-900">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-ink-900/60">Log in to your MUSE account</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-900/60">
        New to MUSE?{' '}
        <Link to="/register" className="font-semibold text-rose-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
