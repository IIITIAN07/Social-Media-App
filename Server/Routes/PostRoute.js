import express from 'express';
import { commentPost, createPost, deletePost, getPost, like_dislike_Post, timeline, updatePost } from '../Controllers/PostController.js';

const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like_dislike', like_dislike_Post);
router.put('/:id/comment', commentPost);
router.get('/:id/timeline', timeline);

export default router;
