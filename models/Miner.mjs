import { wsServer } from "../server.mjs";
import { ledger } from "../server.mjs";
import { memPool } from "../server.mjs";
import { wallet } from "../server.mjs";
import { updateDbBalance } from "../services/wallet-services.mjs";
import Transaction from "./Transaction.mjs";
import Wallet from "./Wallet.mjs";

export default class Miner {

    async mineBlock() {

        const validTransactions = memPool.validateTransactions();

        validTransactions.push(
            Transaction.transactionReward({ miner: wallet })
        );

        ledger.addBlock({
            transactions: validTransactions
        });

        // broadcast the new ledger to all nodes in the network
        wsServer.broadcast();

        // clear the transaction pool
        memPool.clearTransactions();

        // Update the miners db balance and local wallet balance
        const newBalance = Wallet.calculateBalance({ chain: ledger.blocks, address: wallet.publicKey });
        console.log('newbalance', newBalance);
        wallet.balance = newBalance;
        await updateDbBalance({ userId: wallet.userId, balance: newBalance });
    }
}