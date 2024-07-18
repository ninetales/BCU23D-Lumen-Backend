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

export const updateDbBalance = async ({ userId, balance }) => {
    console.log('Updating the balance in the database with balance: %s and %s', balance, userId);
    return await WalletModel.updateOne(
        { user: userId },
        { balance }
    );
};