import { asyncHandler } from "../middleware/async-handler.mjs";
import ResponseModel from "../models/ResponseModel.mjs";
import { getLastBlock } from "../services/block-services.mjs";
import Miner from "../models/Miner.mjs";


/**
 * @desc Get the last block in the blockchain
 */
export const lastBlock = asyncHandler(async (req, res, next) => {
    const lastBlock = await getLastBlock(req.user.id);
    res.status(200).json(new ResponseModel(200, lastBlock));
});

/**
 * @desc Mine a new block
 */
export const mineBlock = asyncHandler(async (req, res, next) => {

    const miner = new Miner();

    miner.mineBlock();

    res.status(200).json(new ResponseModel(200, 'Block mined successfully!'));

});
