import express from 'express';
import {
    register,
    login,
    getUser,
    wallet
} from '../controllers/auth-controller.mjs';
import { protect } from '../middleware/authorization.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', protect, getUser);
router.get('/wallet', protect, wallet);

export default router;