import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { fetchStudio } from '../api/studioApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/format';
import Spinner from '../components/common/Spinner';

const PickCard = ({ product }) => (
  <Link
    to={`/product/${product._id}`}
    className="flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-line-200 bg-white"
  >
    <div className="aspect-square overflow-hidden">
      <img src={product.images?.[0]?.url} alt={product.title} className="h-full w-full object-cover" />
    </div>
    <div className="p-2.5">
      <p className="truncate text-xs font-medium text-ink-900">{product.title}</p>
      <p className="mt-0.5 text-xs font-semibold text-rose-700">{formatPrice(product.price)}</p>
    </div>
  </Link>
);

const SuggestionCard = ({ product }) => {
  const { addItem } = useCart();
  const { ids, toggle } = useWishlist();
  const liked = ids?.has(product._id);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addItem(product._id, 1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative w-44 shrink-0 overflow-hidden rounded-2xl border border-line-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-blush-100">
        <img src={product.images?.[0]?.url} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <button
          onClick={(e) => { e.preventDefault(); toggle(product._id); }}
          className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full shadow ${liked ? 'bg-ink-900 text-white' : 'bg-white/85 text-ink-900/60'}`}
        >
          <FiHeart size={12} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={handleAdd}
          className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white text-rose-700 opacity-0 shadow transition group-hover:translate-y-0 group-hover:opacity-100"
        >
          <FiShoppingBag size={13} />
        </button>
      </div>
      <div className="p-2.5">
        <p className="truncate text-[11px] text-ink-900/40">{product.storeName}</p>
        <p className="truncate text-xs font-medium text-ink-900">{product.title}</p>
        <p className="mt-0.5 text-xs font-semibold text-rose-700">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

const Studio = () => {
  const [data, setData] = useState({ picks: [], suggestions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudio()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-line-200 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink-900/60">
          MUSE Studio
        </span>
        <h1 className="font-display mt-4 text-3xl font-semibold text-ink-900 sm:text-4xl">
          Complete the look
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink-900/55">
          Like a few pieces or add them to your cart, and MUSE Studio pulls together jewelry,
          shoes and bags from other sellers to finish the outfit.
        </p>
      </div>

      {data.picks.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-line-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-ink-900">
            Like a product or add one to your cart to start building a look.
          </p>
          <Link
            to="/catalog"
            className="mt-5 inline-block rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-800"
          >
            Browse the Catalog
          </Link>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-2xl border border-line-200 bg-white p-5"
          >
            <h2 className="text-sm font-semibold text-ink-900">Your Picks</h2>
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {data.picks.map((p) => (
                <PickCard key={p._id} product={p} />
              ))}
            </div>
          </motion.div>

          <div className="mt-12 space-y-10">
            {data.suggestions.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <h2 className="font-display text-xl font-semibold text-ink-900">
                  Complete with {group.label}
                </h2>
                <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
                  {group.products.map((p) => (
                    <SuggestionCard key={p._id} product={p} />
                  ))}
                </div>
              </motion.div>
            ))}

            {data.suggestions.length === 0 && (
              <p className="text-center text-sm text-ink-900/50">
                You've got a great start — check back once more categories are in stock.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Studio;
