import api from './axios';

export const fetchProducts = (params) => api.get('/products', { params }).then((r) => r.data);
export const fetchProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);
export const fetchMyProducts = () => api.get('/products/mine').then((r) => r.data);
export const createProduct = (formData) =>
  api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
export const removeProductImage = (id, publicId) =>
  api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`).then((r) => r.data);
export const fetchCategories = () => api.get('/categories').then((r) => r.data);
