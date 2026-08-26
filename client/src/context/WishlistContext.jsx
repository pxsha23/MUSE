import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistApi';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [ids, setIds] = useState(new Set());

  const refresh = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setProducts([]);
      setIds(new Set());
      return;
    }
    const data = await fetchWishlist();
    setProducts(data.products);
    setIds(new Set(data.products.map((p) => p._id)));
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (productId) => {
    if (!user || user.role !== 'buyer') {
      toast.error('Log in as a buyer to save items you like');
      return;
    }
    const isLiked = ids.has(productId);
    setIds((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(productId) : next.add(productId);
      return next;
    });
    try {
      if (isLiked) await removeFromWishlist(productId);
      else {
        await addToWishlist(productId);
        toast.success('Saved to your likes');
      }
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update likes');
      refresh();
    }
  };

  return (
    <WishlistContext.Provider value={{ products, ids, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
