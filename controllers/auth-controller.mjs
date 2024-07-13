import UserModel from '../models/user-db-model.mjs';
import WalletModel from '../models/wallet-db-model.mjs';
import LedgerModel from '../models/ledger-db-model.mjs';
import ErrorResponse from '../models/ErrorResponseModel.mjs';
import { asyncHandler } from '../middleware/async-handler.mjs';
import ResponseModel from '../models/ResponseModel.mjs';
import Block from '../models/Block.mjs';
import { getWallet } from '../services/wallet-services.mjs';
import { wsServer } from '../server.mjs';
import { wallet } from '../server.mjs';
import { memPool } from '../server.mjs';

/**
 * @desc    Register a new user and generate a key pair
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await UserModel.create({ name, email, password });

    if (user) {

        // Create a wallet and add it to the user
        await WalletModel.create({
            user: user._id,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            balance: wallet.balance
        });

        // Create a ledger and add the genesis block
        const genesisBlock = Block.genesis();
        await LedgerModel.create({
            user: user._id,
            blocks: [genesisBlock]
        });
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

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Send token 
    sendAuthToken(user, 200, res);

    const dbWallet = await getWallet(user._id.toHexString());

    wallet.updateMemCredentials({ wallet: dbWallet });

    // Set the userId for the user
    wsServer.setUserId(user._id.toHexString());

    // Set the memPool for the user
    wsServer.setMemPool(memPool);

    // Start listening to nodes
    wsServer.listen();

});

/**
 * @desc    Get user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id).select('-createdAt -__v');
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
