import express from 'express';
import { ledger } from '../controllers/ledger-controller.mjs';
import { protect } from '../middleware/authorization.mjs';

const router = express.Router();

router.get('/', protect, ledger);

export default router;