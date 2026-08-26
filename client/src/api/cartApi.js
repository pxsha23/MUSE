import api from './axios';

export const fetchCart = () => api.get('/cart').then((r) => r.data);
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart/items', { productId, quantity }).then((r) => r.data);
export const updateCartItem = (productId, quantity) =>
  api.put(`/cart/items/${productId}`, { quantity }).then((r) => r.data);
export const removeCartItem = (productId) =>
  api.delete(`/cart/items/${productId}`).then((r) => r.data);
