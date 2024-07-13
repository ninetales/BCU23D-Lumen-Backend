import { describe, it, expect, beforeEach } from "vitest";
import Wallet from "../models/Wallet.mjs";
import Transaction from "../models/Transaction.mjs";
import MemPool from "../models/MemPool.mjs";

describe('MemPool', () => {
    let memPool, transaction, sender;

    sender = new Wallet();

    beforeEach(() => {
        transaction = new Transaction({
            sender,
            recipient: 'recipient-public-key',
            amount: 50
        });

        memPool = new MemPool();

    });

    describe('Properties', () => {
        it('should have a property named transactionMap', () => {
            expect(memPool).toHaveProperty('transactionMap');
        });
    })

    describe('addTransaction()', () => {
        it('should add a transaction to the mempool', () => {
            memPool.addTransaction({ transaction });
            expect(memPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('transactionExists()', () => {
        it('should return a transaction based on its address', () => {
            memPool.addTransaction({ transaction });
            expect(memPool.transactionExists({ address: sender.publicKey })).toBe(transaction);
        });
    });


})