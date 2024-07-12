import { asyncHandler } from "../middleware/async-handler.mjs";
import ResponseModel from "../models/ResponseModel.mjs";
import Block from "../models/Block.mjs";
import { getLastBlock } from "../services/block-services.mjs";
import Miner from "../models/Miner.mjs";
import Ledger from "../models/Ledger.mjs";
import { getWallet } from "../services/wallet-services.mjs";

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

    const ledger = await Ledger.get({ userId: req.user.id });
    const wallet = await getWallet(req.user.id);
    const mempool = []; //todo: get mempool
    const networkNodes = []; // todo: get network nodes

    const miner = new Miner({
        ledger,
        wallet,
        mempool,
        networkNodes
    });

    miner.mineBlock();

    res.status(200).json(new ResponseModel(200, 'Block mined successfully!'));

});
