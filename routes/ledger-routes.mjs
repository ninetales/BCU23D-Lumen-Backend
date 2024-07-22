import express from 'express';
import { getLedger } from '../controllers/ledger-controller.mjs';
import { protect } from '../middleware/authorization.mjs';

const router = express.Router();

router.get('/', protect, getLedger);

export default router;