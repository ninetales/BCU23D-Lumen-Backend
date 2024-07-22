import { asyncHandler } from "../middleware/async-handler.mjs";
import ResponseModel from "../models/ResponseModel.mjs";
import { ledger } from '../server.mjs';

/**
 * @desc Get the ledger of the authenticated user
 */
export const getLedger = asyncHandler(async (req, res, next) => {
    const chain = ledger.blocks;
    chain && res.status(200).json(new ResponseModel(200, chain));
});