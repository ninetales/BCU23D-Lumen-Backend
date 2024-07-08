import LedgerModel from '../models/ledger-db-model.mjs';

/**
 * @desc Get the ledger of the authenticated user
 * @module services/ledger-services
 */
export const getLedger = async (userId) => {
    return await LedgerModel.findOne({ user: userId }).select('-_id -user -createdAt -__v');
};

export const updateLedger = async ({ userId, ledger }) => {
    // ToDo: Implement updateLedger
}