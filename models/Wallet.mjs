import { INITIAL_BALANCE } from "../config/settings.mjs";
import { generateHash, generateKeys } from "../utilities/crypto-lib.mjs";
import { ellipticHash } from "../utilities/crypto-lib.mjs";
import Transaction from "./Transaction.mjs";

export default class Wallet {

    constructor() {
        this.keyPair = ellipticHash.genKeyPair();
        this.privateKey = this.keyPair.getPrivate('hex');
        this.publicKey = this.keyPair.getPublic('hex');
        this.balance = INITIAL_BALANCE;
    };

    // Intsance methods...
    sign(transaction) {
        return this.keyPair.sign(generateHash(transaction));
    }

    createTransaction({ recipient, amount }) {
        if (amount > this.balance) throw new Error('Amount exceeds balance');
        return new Transaction({ sender: this, recipient, amount });
    }

    updateMemCredentials({ wallet }) {
        this.privateKey = wallet.privateKey;
        this.publicKey = wallet.publicKey;
        this.balance = parseFloat(wallet.balance);
        this.keyPair = ellipticHash.keyFromPrivate(this.privateKey, 'hex');
    }

}