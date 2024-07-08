import Ledger from "./Ledger.mjs";

export default class Miner {

    constructor({ ledger, wallet, mempool, networkNodes }) {
        this.ledger = ledger;
        this.wallet = wallet;
        this.mempool = mempool;
        this.networkNodes = networkNodes;
    }

    mineBlock() {

        // todo: validate transactions from the transaction pool (mempool)
        const validTransactions = ['One Punch']; // temporary
        // todo: create a reward transaction

        // todo: create a block with the valid transactions and place it in the ledger
        Ledger.addBlock({
            userId: this.wallet.user,
            ledger: this.ledger,
            data: validTransactions
        });

        // broadcast the new ledger to all nodes in the network

        // clear the transaction pool
    }
}