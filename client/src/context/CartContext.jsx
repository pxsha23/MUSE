import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchCart, addToCart, updateCartItem, removeCartItem } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ sellers: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user || user.role !== 'buyer') {
      setCart({ sellers: [], total: 0 });
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (productId, quantity = 1) => {
    const data = await addToCart(productId, quantity);
    setCart(data);
    toast.success('Added to cart');
  };

  const changeQuantity = async (productId, quantity) => {
    const data = await updateCartItem(productId, quantity);
    setCart(data);
  };

  const removeItem = async (productId) => {
    const data = await removeCartItem(productId);
    setCart(data);
  };

  const itemCount = cart.sellers.reduce(
    (sum, s) => sum + s.items.reduce((n, i) => n + i.quantity, 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, refresh, addItem, changeQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
