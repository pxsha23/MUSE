import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchMyProducts, deleteProduct } from '../../api/productApi';
import { formatPrice } from '../../utils/format';
import Spinner from '../../components/common/Spinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetchMyProducts().then((data) => setProducts(data.items));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Remove this product? It will no longer be visible to buyers.')) return;
    try {
      await deleteProduct(id);
      toast.success('Product removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove product');
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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-900">Your Products</h2>
        <Link
          to="/seller/products/new"
          className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-sm text-ink-900/50">You haven't added any products yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 rounded-2xl border border-blush-200 bg-white p-4">
              <img src={p.images?.[0]?.url} alt={p.title} className="h-16 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-900">{p.title}</p>
                <p className="text-xs text-ink-900/50">{formatPrice(p.price)} · Stock: {p.stock}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  p.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {p.isPublished ? 'Live' : 'Draft'}
              </span>
              <Link
                to={`/seller/products/${p._id}/edit`}
                className="text-sm font-medium text-rose-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-sm font-medium text-ink-900/40 hover:text-rose-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
