import LedgerModel from '../models/ledger-db-model.mjs';

/**
 * @desc Get the ledger of the authenticated user
 * @module services/ledger-services
 */
export const getLedgerFromDb = async (userId) => {
    return await LedgerModel.findOne({ user: userId }).select('-_id -user -createdAt -__v');
};

export const updateLedgerInDb = async ({ userId, ledger }) => {
    console.log('Updating ledger in the database');
    return await LedgerModel.updateOne(
        { user: userId },
        { $set: { blocks: ledger.blocks } }
    );
}