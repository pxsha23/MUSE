import api from './axios';

export const fetchWishlist = () => api.get('/wishlist').then((r) => r.data);
export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`).then((r) => r.data);
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`).then((r) => r.data);
