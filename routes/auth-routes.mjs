import express from 'express';
import {
    register,
    login,
    getUser
} from '../controllers/auth-controller.mjs';
import { protect } from '../middleware/authorization.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', protect, getUser);

export default router;