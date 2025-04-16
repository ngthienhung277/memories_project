import express from 'express';

import { } from '../controllers/posts.js';
import { signin, signup } from '../../client/src/actions/auth.js';

const router = express.Router();
router.post('/signin', signin)
router.post('/signup', signup)

export default router;
