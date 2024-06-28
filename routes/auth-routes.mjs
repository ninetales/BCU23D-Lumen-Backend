import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({ success: true, message: 'Auth route' });
});

export default router;