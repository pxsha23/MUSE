import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';
import { fetchProduct } from '../api/productApi';
import { formatPrice } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Spinner from '../components/common/Spinner';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { ids: likedIds, toggle: toggleLike } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then((data) => setProduct(data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <Link to="/catalog" className="mt-4 inline-block text-rose-600">Back to catalog</Link>
      </div>
    );
  }

  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAdd = async () => {
    if (!user) return toast.error('Log in as a buyer to add items to your cart');
    if (user.role !== 'buyer') return toast.error('Only buyer accounts can shop');
    setAdding(true);
    try {
      await addItem(product._id, quantity);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-blush-100">
            <img
              src={product.images[activeImage]?.url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? 'border-rose-500' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link
            to={`/store/${product.storeSlug}`}
            className="text-xs font-semibold uppercase tracking-wide text-rose-600 hover:underline"
          >
            {product.storeName}
          </Link>
          <h1 className="font-display mt-1 text-3xl font-bold text-ink-900">{product.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-rose-700">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-base text-ink-900/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-ink-900/70">
            {product.description}
          </p>

          <p className="mt-4 text-xs text-ink-900/50">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-blush-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ink-900/60"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 1, q + 1))}
                className="px-3 py-2 text-ink-900/60"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={adding || product.stock === 0}
              className="flex-1 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
            >
              {product.stock === 0 ? 'Out of stock' : adding ? 'Adding…' : 'Add to Cart'}
            </button>

            <button
              onClick={() => toggleLike(product._id)}
              aria-label="Like"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition ${
                likedIds?.has(product._id)
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-blush-200 text-ink-900/50 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              <FiHeart size={18} fill={likedIds?.has(product._id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <Link
            to="/studio"
            className="mt-4 inline-block text-xs font-semibold text-rose-700 hover:underline"
          >
            See what completes this look in MUSE Studio →
          </Link>

          {product.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span key={t} className="rounded-full bg-blush-100 px-3 py-1 text-xs text-ink-900/60">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
