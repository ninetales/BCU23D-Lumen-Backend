import Ledger from "./Ledger.mjs";
import { wsServer } from "../server.mjs";
import { ledger } from "../server.mjs";
import { memPool } from "../server.mjs";
import { wallet } from "../server.mjs";
import Transaction from "./Transaction.mjs";

export default class Miner {

    // constructor({ ledger, wallet, mempool }) {
    //     this.ledger = ledger;
    //     this.wallet = wallet;
    //     this.mempool = mempool;
    //     // this.networkNodes = networkNodes;
    // }

    async mineBlock() {
        console.log('Mine block...', ledger);
        console.log('memPool...', memPool);
        console.log('Wallet...', wallet);
        // todo: validate transactions from the transaction pool (mempool)
        const validTransactions = memPool.validateTransactions();
        // const validTransactions = {
        //     "dummy": "dummy",
        //     "hello": "world"
        // };
        console.log('the valid transactions', validTransactions);
        console.log('Mine Block -1: validated transactions completed');

        console.log('The miners wallet', wallet);

        // todo: create a reward transaction
        validTransactions.push(
            Transaction.transactionReward({ miner: wallet })
        );

        // console.log('Mine Block -2: created a reward transaction completed', validTransactions);

        // todo: create a block with the valid transactions and place it in the ledger
        ledger.addBlock({
            transactions: validTransactions
        });
        console.log('Mine Block -3: created a block with the valid transactions completed');

        // this.ledger.blocks.push(newBlock);
        // ledger.addBlock(newBlock);
        console.log('The new ledger', ledger);

        // broadcast the new ledger to all nodes in the network
        wsServer.broadcast();

        // clear the transaction pool
        memPool.clearTransactions();

        // const reward = Transaction.transactionReward({ miner: wallet });
        // memPool.addTransaction({ transaction: reward });
        // console.log('Reward', reward);
        // wsServer.broadcastTransaction({ transaction: reward });
    }
}