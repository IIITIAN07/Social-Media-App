import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

export const getNotifications = (userId) => API.get(`/notification/${userId}`);
export const markNotificationRead = (id) => API.put(`/notification/${id}/read`);
export const markAllNotificationsRead = (userId) => API.put(`/notification/${userId}/read-all`);
