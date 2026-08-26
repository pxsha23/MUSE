import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      await refresh();
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="font-display text-3xl font-bold text-ink-900">My Account</h1>

      {!user.emailVerified && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Your email isn't verified yet.{' '}
          <Link to="/verify-email" className="font-semibold underline">Verify now</Link> to check out.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Email</label>
          <input
            disabled
            value={user.email}
            className="w-full rounded-xl border border-blush-200 bg-blush-50 px-4 py-2.5 text-sm text-ink-900/50"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <div className="mt-10 border-t border-blush-200 pt-6">
        <Link to="/orders" className="text-sm font-semibold text-rose-600 hover:underline">
          View my orders →
        </Link>
      </div>
    </div>
  );
};

export default Account;
