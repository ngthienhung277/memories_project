import express from 'express';

import { getPostsBySearch, getPost, getPosts, createPost, updatePost, deletePost, likePost, commentPost } from '../controllers/posts.js'

import auth from '../middleware/auth.js';


const router = express.Router();


//http://localhost:5000/posts
router.get('/search', getPostsBySearch)
router.get('/:id', getPost);
router.get('/', getPosts);

router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', commentPost);

export default router;