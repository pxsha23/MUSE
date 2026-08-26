import api from './axios';

export const fetchStoreBySlug = (slug) => api.get(`/stores/${slug}`).then((r) => r.data);
export const fetchMyStore = () => api.get('/stores/me').then((r) => r.data);
export const updateMyStore = (payload) => api.put('/stores/me', payload).then((r) => r.data);
export const uploadStoreLogo = (formData) =>
  api.post('/stores/me/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const uploadStoreBanner = (formData) =>
  api.post('/stores/me/banner', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
