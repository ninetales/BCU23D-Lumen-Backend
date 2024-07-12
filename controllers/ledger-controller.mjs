import { asyncHandler } from "../middleware/async-handler.mjs";
import ResponseModel from "../models/ResponseModel.mjs";
import Ledger from "../models/Ledger.mjs";

/**
 * @desc Get the ledger of the authenticated user
 */
export const ledger = asyncHandler(async (req, res, next) => {
    const ledger = await Ledger.get({ userId: req.user.id });
    ledger && res.status(200).json(new ResponseModel(200, ledger));
});