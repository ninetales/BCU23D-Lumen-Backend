import Ledger from "./Ledger.mjs";
import { wsServer } from "../server.mjs";
import { ledger } from "../server.mjs";

export default class Miner {

    // constructor({ ledger, wallet, mempool }) {
    //     this.ledger = ledger;
    //     this.wallet = wallet;
    //     this.mempool = mempool;
    //     // this.networkNodes = networkNodes;
    // }

    async mineBlock() {

        // todo: validate transactions from the transaction pool (mempool)
        const validTransactions = [{
            dummy: 'one punch'
        }, { dummy: 'Batman' }]; // temporary

        // todo: create a reward transaction

        // todo: create a block with the valid transactions and place it in the ledger
        ledger.addBlock({
            transactions: validTransactions
        });

        // this.ledger.blocks.push(newBlock);
        // ledger.addBlock(newBlock);
        console.log('The new ledger', ledger);

        // broadcast the new ledger to all nodes in the network
        wsServer.broadcast();

        // clear the transaction pool
    }
}