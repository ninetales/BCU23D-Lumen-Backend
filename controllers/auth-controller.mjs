import User from '../models/user-model.mjs';
import { asyncHandler } from '../middleware/async-handler.mjs';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    sendAuthToken(user, 201, res);
});

const sendAuthToken = (user, statusCode, res) => {
    const token = user.generateAuthToken();
    res.status(200).json({ sucess: true, statusCode, token });
};