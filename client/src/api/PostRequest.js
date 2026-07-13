import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

export const getTimelinePosts = (id) => API.get(`/post/${id}/timeline`);
export const likePost = (id, userId) => API.put(`post/${id}/like_dislike`, { userId: userId })
export const commentPost = (id, comment) => API.put(`post/${id}/comment`, comment)
export const deletePost = (id, userId) => API.delete(`post/${id}`, { data: { userId } })
