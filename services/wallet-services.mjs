import WalletModel from '../models/wallet-db-model.mjs';

/**
 * @desc Get the wallet of the authenticated user
 * @returns 
 */
export const getWallet = async (userId) => {
    return await WalletModel.findOne({ user: userId }).select('-_id -createdAt -__v');
}


/**
 * @desc Get the wallet of the authenticated user
 * @returns 
 */
export const getWalletBalance = async (userId) => {
    return await WalletModel.findOne({ user: userId }).select('-_id -user -createdAt -__v -privateKey -publicKey');
}