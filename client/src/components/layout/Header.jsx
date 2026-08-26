import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiShoppingBag, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/format';
import CategoryNav from './CategoryNav';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount, addItem } = useCart();
  const { products: likedProducts, toggle: toggleLike } = useWishlist();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [search, setSearch] = useState('');
  const accountRef = useRef(null);
  const searchRef = useRef(null);
  const favoritesRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (favoritesRef.current && !favoritesRef.current.contains(e.target)) setFavoritesOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/catalog?search=${encodeURIComponent(search.trim())}` : '/catalog');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleAddFavoriteToCart = async (productId) => {
    try {
      await addItem(productId, 1);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to cart');
    }
  };

  const accountHome = user?.role === 'seller' ? '/seller/products' : '/account';

  return (
    <header className="sticky top-0 z-40 border-b border-line-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
        <button
          className="text-ink-900 lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <Link to="/" className="font-display shrink-0 text-2xl font-semibold tracking-wide text-ink-900 sm:text-[1.7rem]">
          MUSE
        </Link>

        <nav className="ml-8 hidden items-center gap-7 lg:flex">
          <CategoryNav className="flex items-center gap-7" />
          {(!user || user.role === 'buyer') && (
            <Link
              to="/studio"
              className="whitespace-nowrap text-sm font-medium text-ink-900/70 hover:text-rose-700"
            >
              MUSE Studio
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-5 sm:gap-6">
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="text-ink-900/80 hover:text-rose-700"
              aria-label="Search"
            >
              <FiSearch size={19} />
            </button>
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  onSubmit={submitSearch}
                  className="glass-panel absolute right-0 top-11 flex w-72 items-center gap-2 rounded-xl p-3 shadow-lg sm:w-80"
                >
                  <FiSearch className="shrink-0 text-ink-900/35" size={16} />
                  <input
                    ref={searchInputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search dresses, jewelry, shoes…"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-900/35"
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {(!user || user.role === 'buyer') && (
            <div ref={favoritesRef} className="relative">
              <button
                onClick={() => (user ? setFavoritesOpen((v) => !v) : navigate('/login'))}
                className="text-ink-900/80 hover:text-rose-700"
                aria-label="Favorites"
              >
                <FiHeart size={19} />
              </button>
              <AnimatePresence>
                {user && favoritesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="glass-panel absolute right-0 top-11 w-72 overflow-hidden rounded-xl shadow-lg"
                  >
                    <p className="border-b border-white/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-900/50">
                      Your Favorites
                    </p>
                    {likedProducts.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-ink-900/50">
                        Nothing saved yet. Tap the heart on a product to keep it here.
                      </p>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {likedProducts.map((p) => (
                          <div key={p._id} className="flex items-center gap-3 border-b border-white/50 px-4 py-3 last:border-0">
                            <Link
                              to={`/product/${p._id}`}
                              onClick={() => setFavoritesOpen(false)}
                              className="h-12 w-10 shrink-0 overflow-hidden rounded-md border border-white/60"
                            >
                              <img src={p.images?.[0]?.url} alt={p.title} className="h-full w-full object-cover" />
                            </Link>
                            <Link
                              to={`/product/${p._id}`}
                              onClick={() => setFavoritesOpen(false)}
                              className="min-w-0 flex-1"
                            >
                              <p className="truncate text-xs font-medium text-ink-900">{p.title}</p>
                              <p className="text-xs text-ink-900/50">{formatPrice(p.price)}</p>
                            </Link>
                            <button
                              onClick={() => handleAddFavoriteToCart(p._id)}
                              className="shrink-0 rounded-full border border-ink-900/15 p-1.5 text-ink-900/70 hover:border-rose-400 hover:text-rose-700"
                              aria-label="Add to cart"
                            >
                              <FiShoppingBag size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div ref={accountRef} className="relative">
            <button
              onClick={() => (user ? setAccountOpen((v) => !v) : navigate('/login'))}
              className="flex items-center gap-1.5 text-sm font-medium text-ink-900/80 hover:text-rose-700"
            >
              <FiUser size={19} />
              <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Login'}</span>
            </button>
            <AnimatePresence>
              {user && accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="glass-panel absolute right-0 top-11 w-52 overflow-hidden rounded-xl shadow-lg"
                >
                  <Link
                    to={accountHome}
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-sm text-ink-900 hover:bg-white/60"
                  >
                    {user.role === 'seller' ? 'Seller Dashboard' : 'My Account'}
                  </Link>
                  {user.role === 'buyer' && (
                    <>
                      <Link
                        to="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink-900 hover:bg-white/60"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/studio"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink-900 hover:bg-white/60"
                      >
                        MUSE Studio
                      </Link>
                    </>
                  )}
                  {!user.emailVerified && (
                    <Link
                      to="/verify-email"
                      onClick={() => setAccountOpen(false)}
                      className="block border-t border-white/60 px-4 py-2.5 text-sm text-rose-700 hover:bg-white/60"
                    >
                      Verify email
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setAccountOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="block w-full border-t border-white/60 px-4 py-2.5 text-left text-sm text-ink-900/60 hover:bg-white/60"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {(!user || user.role === 'buyer') && (
            <Link to="/cart" className="relative text-ink-900/80 hover:text-rose-700">
              <FiShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {(!user || user.role === 'buyer') && (
            <Link
              to="/register"
              className="hidden rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-800 lg:block"
            >
              Sell on MUSE
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line-200 bg-white lg:hidden"
          >
            <div className="px-6 py-4">
              <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 rounded-xl border border-line-200 px-4 py-2.5">
                <FiSearch className="text-ink-900/35" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search MUSE"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </form>
              <CategoryNav className="flex flex-col gap-3" onNavigate={() => setMenuOpen(false)} />
              {(!user || user.role === 'buyer') && (
                <Link
                  to="/studio"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 block text-sm font-medium text-ink-900/70"
                >
                  MUSE Studio
                </Link>
              )}
              {(!user || user.role === 'buyer') && (
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 block text-sm font-semibold text-rose-700"
                >
                  Sell on MUSE
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
