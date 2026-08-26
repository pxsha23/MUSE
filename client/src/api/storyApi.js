import api from './axios';

export const fetchStoryFeed = () => api.get('/stories/feed').then((r) => r.data);
export const fetchMyStories = () => api.get('/stories/mine').then((r) => r.data);
export const createStory = (formData) =>
  api.post('/stories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteStory = (id) => api.delete(`/stories/${id}`).then((r) => r.data);
