import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

export const getConversations = (userId) => API.get(`/conversation/${userId}`);
export const createConversation = (senderId, receiverId) => API.post('/conversation', { senderId, receiverId });
export const getMessages = (conversationId) => API.get(`/message/${conversationId}`);
export const createMessage = (message) => API.post('/message', message);
export const markMessagesRead = (conversationId, userId) => API.put(`/message/${conversationId}/read`, { userId });
