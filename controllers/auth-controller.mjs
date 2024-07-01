import User from '../models/user-model.mjs';
import Key from '../models/key-model.mjs';
import { generateKeys } from '../utilities/crypto-lib.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import { asyncHandler } from '../middleware/async-handler.mjs';
import ResponseModel from '../models/ResponseModel.mjs';

/**
 * @desc    Register a new user and generate a key pair
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });

    if (user) {
        const keys = generateKeys();
        await Key.create({ user: user._id, privateKey: keys.privateKey, publicKey: keys.publicKey });
    }

    sendAuthToken(user, 201, res);
});

/**
 * @desc   Login a user
 * @route  POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendAuthToken(user, 200, res);

});

/**
 * @desc    Get user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(new ResponseModel(200, user));
});

/**
 * @desc Generates a token and sends it in the response
 * @param {Object} user - contains the user object data
 * @param {Number} statusCode - contains the HTTP status code to be sent in the response
 * @param {Object} res - contains the express response object
 */
const sendAuthToken = (user, statusCode, res) => {
    const token = user.generateAuthToken();
    res.status(200).json({ sucess: true, statusCode, token });
};