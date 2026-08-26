import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchMyProducts,
  createProduct,
  updateProduct,
  removeProductImage,
} from '../../api/productApi';
import { CATEGORY_NAV } from '../../components/layout/CategoryNav';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/common/Spinner';
import Dropdown from '../../components/common/Dropdown';

const EMPTY = { title: '', description: '', category: 'dresses', price: '', compareAtPrice: '', stock: '', tags: '' };

const ProductEdit = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    fetchMyProducts()
      .then((data) => {
        const product = data.items.find((p) => p._id === id);
        if (!product) return toast.error('Product not found');
        setForm({
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          compareAtPrice: product.compareAtPrice || '',
          stock: product.stock,
          tags: product.tags.join(', '),
        });
        setExistingImages(product.images);
        setIsPublished(product.isPublished);
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPublished && !user.emailVerified) {
      toast.error('Verify your email before publishing this product live');
      return;
    }
    if (!isEdit && newImages.length === 0) {
      toast.error('Add at least one product image');
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append('isPublished', isPublished);
    newImages.forEach((f) => data.append('images', f));
    if (video) data.append('video', video);

    setSaving(true);
    try {
      if (isEdit) {
        await updateProduct(id, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExistingImage = async (publicId) => {
    try {
      await removeProductImage(id, publicId);
      setExistingImages((imgs) => imgs.filter((i) => i.publicId !== publicId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove image');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const input = (key, label, extra = {}) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-900/60">{label}</label>
      <input
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
        {...extra}
      />
    </div>
  );

  return (
    <div>
      <Link to="/seller/products" className="text-sm text-rose-600 hover:underline">← Back to products</Link>
      <h2 className="mt-2 text-lg font-semibold text-ink-900">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
        {input('title', 'Title', { required: true })}

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Category</label>
          <Dropdown
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={CATEGORY_NAV}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {input('price', 'Price (₹)', { type: 'number', min: 0, required: true })}
          {input('compareAtPrice', 'Compare-at price (₹, optional)', { type: 'number', min: 0 })}
        </div>
        {input('stock', 'Stock quantity', { type: 'number', min: 0, required: true })}
        {input('tags', 'Tags (comma separated)')}

        {existingImages.length > 0 && (
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-900/60">Current images</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <div key={img.publicId} className="relative">
                  <img src={img.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.publicId)}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">
            {isEdit ? 'Add more images' : 'Product images'}
          </label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            className="w-full text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-ink-900/60">Video (optional)</label>
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-900/70">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Publish live (visible in the public catalog)
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
      </form>
    </div>
  );
};

export default ProductEdit;
