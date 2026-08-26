import api from './axios';

export const registerUser = (payload) => api.post('/auth/register', payload).then((r) => r.data);
export const loginUser = (payload) => api.post('/auth/login', payload).then((r) => r.data);
export const logoutUser = () => api.post('/auth/logout').then((r) => r.data);
export const fetchMe = () => api.get('/auth/me').then((r) => r.data);
export const verifyOtp = (code) => api.post('/auth/verify-otp', { code }).then((r) => r.data);
export const resendOtp = () => api.post('/auth/resend-otp').then((r) => r.data);
export const updateProfile = (payload) => api.put('/users/me', payload).then((r) => r.data);
