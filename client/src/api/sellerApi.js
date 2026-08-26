import api from './axios';

export const fetchSellerOrders = () => api.get('/seller/orders').then((r) => r.data);
export const fetchSellerOrder = (id) => api.get(`/seller/orders/${id}`).then((r) => r.data);
export const updateSellerOrderStatus = (id, payload) =>
  api.put(`/seller/orders/${id}/status`, payload).then((r) => r.data);
