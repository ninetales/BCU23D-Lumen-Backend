import LedgerModel from '../models/ledger-db-model.mjs';

/**
 * @desc Get the last block in the users ledger
 * @returns 
 */
export const getLastBlock = async (userId) => {
    const result = await LedgerModel.findOne(
        { user: userId },
        { 'blocks': { $slice: -1 } }
    ).select('-_id -user -createdAt -__v');
    return result.blocks[0];
};

/**
 * @desc Add a new block to the users ledger
 * @returns 
 */
export const addBlockToDb = async ({ userId, newBlock }) => {
    return await LedgerModel.findOneAndUpdate(
        { user: userId },
        { $push: { blocks: newBlock } },
        { new: true }
    );
};
