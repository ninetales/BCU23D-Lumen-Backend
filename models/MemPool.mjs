import Transaction from "./Transaction.mjs";

export default class MemPool {
    constructor() {
        this.transactionMap = {};
    }

    addTransaction({ transaction }) {
        this.transactionMap[transaction.id] = transaction;
    }

    transactionExists({ address }) {
        const transactions = Object.values(this.transactionMap);

        return transactions.find(
            (transaction) => transaction.inputMap.address === address
        );
    }

    clearBlockTransactions({ chain }) {
        // Loop through the chain starting from the second block...
        for (let i = 1; i < chain.length; i++) {

            // Get the current block...
            const block = chain[i];

            // Loop through the transactions in the block...
            for (let transaction of block.transactions) {

                // Check if the transaction exists in the transactionMap...
                if (this.transactionMap[transaction.id]) {

                    // Delete the transaction from the transactionMap...
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }

    clearTransactions() {
        this.transactionMap = {};
    }

    replaceTransactionMap({ transactionMap }) {
        const localMemPoolSize = Object.keys(this.transactionMap).length;
        const foreignMemPoolSize = Object.keys(transactionMap).length;
        console.log('This.transactionmap length', localMemPoolSize);
        console.log('Foreign transactionmap length', foreignMemPoolSize);
        if (localMemPoolSize >= foreignMemPoolSize) return;
        this.transactionMap = transactionMap;
    }

    validateTransactions() {
        const validTransactions = Object.values(this.transactionMap).filter(
            (transaction) => Transaction.validate({ transaction })
        );
        return validTransactions;
    }
}