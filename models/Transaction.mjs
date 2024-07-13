import { v4 as uuidv4 } from 'uuid';
import { verifySignature } from '../utilities/crypto-lib.mjs';

export default class Transaction {
    constructor({ sender, recipient, amount, inputMap, outputMap }) {
        this.id = uuidv4().replaceAll('-', '');
        this.outputMap = inputMap || this.generateOutputMap({ sender, recipient, amount });
        this.inputMap = outputMap || this.generateInputMap({ sender, outputMap: this.outputMap });
    }

    generateOutputMap({ sender, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[sender.publicKey] = sender.balance - amount;

        return outputMap;

    }

    generateInputMap({ sender, outputMap }) {

        return {
            timestamp: Date.now(),
            amount: sender.balance,
            address: sender.publicKey,
            signature: sender.sign(outputMap)
        }

    }

    update({ sender, recipient, amount }) {
        if (amount > this.outputMap[sender.publicKey])
            throw new Error('Amount exceeds balance');

        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        this.outputMap[sender.publicKey] =
            this.outputMap[sender.publicKey] - amount;

        this.inputMap = this.generateInputMap({ sender, outputMap: this.outputMap });
    }

    // Static methods...
    static validate({ transaction }) {
        const {
            inputMap: { address, amount, signature },
            outputMap,
        } = transaction;

        const outputTotal = Object.values(outputMap).reduce(
            (total, amount) => total + amount
        );

        if (amount !== outputTotal) {
            return false;
        }

        if (!verifySignature({ publicKey: address, transaction: outputMap, signature })) {
            return false;
        }

        return true;
    }
}