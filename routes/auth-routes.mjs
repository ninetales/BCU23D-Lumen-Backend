import express from 'express';
import { register } from '../controllers/auth-controller.mjs';

const router = express.Router();

// router.get('/', (req, res, next) => {
//     res.status(200).json({ success: true, message: 'Auth route' });
// });

router.post('/register', register);

export default router;