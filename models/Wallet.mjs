import { INITIAL_BALANCE } from "../config/settings.mjs";
import { generateHash } from "../utilities/crypto-lib.mjs";
import { ellipticHash } from "../utilities/crypto-lib.mjs";
import Transaction from "./Transaction.mjs";

export default class Wallet {

    constructor({ userId } = {}) {
        this.userId = userId;
        this.keyPair = ellipticHash.genKeyPair();
        this.privateKey = this.keyPair.getPrivate('hex');
        this.publicKey = this.keyPair.getPublic('hex');
        this.balance = INITIAL_BALANCE;
    };

    setUserId({ userId }) {
        this.userId = userId;
    }

    // Intsance methods...
    sign(transaction) {
        return this.keyPair.sign(generateHash(transaction));
    }

    createTransaction({ recipient, amount, chain }) {
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
            console.log('The balance after calculation', this.balance);
        }

        if (amount > this.balance) throw new Error('Amount exceeds balance');

        return new Transaction({ sender: this, recipient, amount });
    }

    updateMemCredentials({ wallet }) {
        this.privateKey = wallet.privateKey;
        this.publicKey = wallet.publicKey;
        this.balance = parseFloat(wallet.balance);
        this.keyPair = ellipticHash.keyFromPrivate(this.privateKey, 'hex');
    }

    static calculateBalance({ chain, address }) {
        let total = 0;
        let hasConductedTransaction = false;

        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];
            console.log('THE BLOCK', chain[i]);

            for (let transaction of block.transactions) {
                if (transaction.inputMap.address === address) {
                    hasConductedTransaction = true;
                }

                const value = transaction.outputMap[address];

                if (value) {
                    total += value;
                }
            }

            if (hasConductedTransaction) break;
        }

        return hasConductedTransaction ? total : INITIAL_BALANCE + total;
    }

}