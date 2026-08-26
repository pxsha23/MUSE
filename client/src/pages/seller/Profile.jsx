import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchMyStore, updateMyStore, uploadStoreLogo, uploadStoreBanner } from '../../api/storeApi';
import Spinner from '../../components/common/Spinner';

const Profile = () => {
  const [store, setStore] = useState(null);
  const [form, setForm] = useState({ storeName: '', bio: '', instagram: '', facebook: '', pinterest: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyStore()
      .then(({ store }) => {
        setStore(store);
        setForm({
          storeName: store.storeName,
          bio: store.bio || '',
          instagram: store.socialLinks?.instagram || '',
          facebook: store.socialLinks?.facebook || '',
          pinterest: store.socialLinks?.pinterest || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { store: updated } = await updateMyStore({
        storeName: form.storeName,
        bio: form.bio,
        socialLinks: { instagram: form.instagram, facebook: form.facebook, pinterest: form.pinterest },
      });
      setStore(updated);
      toast.success('Store profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update store');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (type, file) => {
    if (!file) return;
    const data = new FormData();
    data.append(type, file);
    try {
      const { store: updated } = await (type === 'logo' ? uploadStoreLogo(data) : uploadStoreBanner(data));
      setStore(updated);
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} updated`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink-900">Store Profile</h2>

      <div className="mt-6 flex flex-wrap gap-8">
        <div>
          <p className="mb-2 text-xs font-medium text-ink-900/60">Logo</p>
          <div className="h-20 w-20 overflow-hidden rounded-full bg-blush-100">
            {store.logoUrl && <img src={store.logoUrl} alt="" className="h-full w-full object-cover" />}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload('logo', e.target.files[0])}
            className="mt-2 w-40 text-xs"
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-ink-900/60">Banner</p>
          <div className="h-20 w-40 overflow-hidden rounded-xl bg-blush-100">
            {store.bannerUrl && <img src={store.bannerUrl} alt="" className="h-full w-full object-cover" />}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload('banner', e.target.files[0])}
            className="mt-2 w-40 text-xs"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Store name</label>
          <input
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Instagram URL</label>
          <input
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Facebook URL</label>
          <input
            value={form.facebook}
            onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
