import express from 'express';
import { mineBlock } from '../controllers/block-controller.mjs';
import { protect } from '../middleware/authorization.mjs';

const router = express.Router();

router.post('/mine', protect, mineBlock);

export default router;