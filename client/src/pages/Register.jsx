import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', storeName: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { devOtp } = await register({ ...form, role });
      if (!devOtp) toast.success('Check your email for a verification code');
      navigate('/verify-email', { state: { devOtp } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="grid grid-cols-2 gap-2 rounded-full bg-blush-100 p-1">
        <Link
          to="/login"
          className="rounded-full py-2 text-center text-sm font-semibold text-ink-900/50 transition hover:text-ink-900"
        >
          Log In
        </Link>
        <span className="rounded-full bg-white py-2 text-center text-sm font-semibold text-rose-700 shadow-sm">
          Create Account
        </span>
      </div>

      <h1 className="font-display mt-6 text-center text-3xl font-bold text-ink-900">Join MUSE</h1>
      <p className="mt-2 text-center text-sm text-ink-900/60">
        Already have a shop or account? Use Log In above instead.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-blush-100 p-1">
        {['buyer', 'seller'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-full py-2 text-sm font-semibold capitalize transition ${
              role === r ? 'bg-white text-rose-600 shadow-sm' : 'text-ink-900/50'
            }`}
          >
            {r === 'buyer' ? 'Shop on MUSE' : 'Sell on MUSE'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>

        {role === 'seller' && (
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-900/60">Store name</label>
            <input
              required
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              placeholder="e.g. Ivory Thread"
              className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
            />
          </div>
        )}

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
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Phone (optional)</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
          <p className="mt-1 text-[11px] text-ink-900/40">At least 8 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-900/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-rose-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
