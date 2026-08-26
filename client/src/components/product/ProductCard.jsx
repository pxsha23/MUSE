import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { formatPrice } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { ids, toggle } = useWishlist();
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const liked = ids?.has(product._id);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Log in as a buyer to add items to your cart');
    if (user.role !== 'buyer') return toast.error('Only buyer accounts can shop');
    try {
      await addItem(product._id, 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    toggle(product._id);
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link
        to={`/product/${product._id}`}
        className="group block overflow-hidden rounded-3xl border border-blush-200 bg-white transition-shadow hover:shadow-2xl hover:shadow-rose-300/30"
      >
        <div className="relative aspect-4/5 overflow-hidden bg-blush-100">
          <img
            src={product.images?.[0]?.url}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          {onSale && (
            <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-md shadow-rose-600/30">
              SALE
            </span>
          )}
          <button
            onClick={handleLike}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition ${
              liked ? 'bg-rose-600 text-white' : 'bg-white/80 text-ink-900/60 hover:text-rose-600'
            }`}
            aria-label="Like"
          >
            <FiHeart size={15} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-rose-600 opacity-0 shadow-md transition group-hover:translate-y-0 group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <FiShoppingBag size={17} />
          </button>
        </div>
        <div className="p-3.5">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-ink-900/40">
            {product.storeName}
          </p>
          <h3 className="mt-0.5 truncate text-sm font-medium text-ink-900">{product.title}</h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-rose-700">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-xs text-ink-900/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
