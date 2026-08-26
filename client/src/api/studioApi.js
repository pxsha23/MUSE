import api from './axios';

export const fetchStudio = () => api.get('/studio').then((r) => r.data);
