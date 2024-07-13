import express from 'express';
import { addTransaction, getTransactionPool, walletCredentials } from '../controllers/transaction-controller.mjs';
import { protect } from '../middleware/authorization.mjs';

const router = express.Router();

router.post('/transaction', protect, addTransaction);
router.get('/transactions', protect, getTransactionPool);
router.get('/credentials', protect, walletCredentials);

export default router;