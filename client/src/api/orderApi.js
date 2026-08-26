import api from './axios';

export const createOrder = (shippingAddress) =>
  api.post('/orders', { shippingAddress }).then((r) => r.data);
export const verifyPayment = (payload) => api.post('/orders/verify', payload).then((r) => r.data);
export const fetchMyOrders = () => api.get('/orders').then((r) => r.data);
export const fetchMyOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);
