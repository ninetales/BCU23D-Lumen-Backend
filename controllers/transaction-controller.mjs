import { asyncHandler } from "../middleware/async-handler.mjs";
import ResponseModel from "../models/ResponseModel.mjs";
import { wallet, wsServer } from "../server.mjs";
import { memPool } from "../server.mjs";

export const addTransaction = asyncHandler(async (req, res, next) => {
    const { recipient, amount } = req.body;

    let transaction = memPool.transactionExists({ address: wallet.publicKey });

    if (transaction) {
        transaction.update({ sender: wallet, recipient, amount });
    } else {
        transaction = wallet.createTransaction({ recipient, amount });
    }

    memPool.addTransaction({ transaction });

    // todo: broadcast to all nodes
    wsServer.broadcastTransaction({ transaction });

    res.status(200).json(new ResponseModel(200, transaction));
});

export const getTransactionPool = asyncHandler(async (req, res, next) => {
    res.status(200).json(new ResponseModel(200, memPool.transactionMap));
});

/**
 * @desc Get the wallet of the authenticated user
 */
export const walletCredentials = asyncHandler(async (req, res, next) => {
    // const wallet = await getWallet(req.user.id);
    wallet && res.status(200).json(new ResponseModel(200, wallet));
});