import { describe, it, expect, beforeEach, vi } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import Ledger from '../models/Ledger.mjs';
import Transaction from '../models/Transaction.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';
import { INITIAL_BALANCE } from '../config/settings.mjs';

describe('Wallet', () => {

    const wallet = new Wallet();

    it('should be an instance of Wallet', () => {
        expect(wallet).toBeInstanceOf(Wallet);
    });

    describe('Properties', () => {

        it('should have a privateKey property', () => {
            expect(wallet).toHaveProperty('privateKey');
        });

        it('should have a property publicKey', () => {
            expect(wallet).toHaveProperty('publicKey');
        });

        it('should have a balance property', () => {
            expect(wallet).toHaveProperty('balance');
        });

    });

    describe('Signature process', () => {
        let transaction = 'Hello World';

        it('should verify a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    transaction,
                    signature: wallet.sign(transaction),
                })
            ).toBe(true);
        });

        it('should not verify an invalid signature', () => {
            const isVerified = verifySignature({
                publicKey: wallet.publicKey,
                transaction,
                signature: new Wallet().sign(transaction)
            })
            expect(isVerified).toBe(false);
        });

    });

    describe('Create transaction', () => {

        describe('and the amount is larger than the balance', () => {
            it('should throw an error', () => {
                expect(() =>
                    wallet.createTransaction({ amount: 898989, recipient: 'Darth Vader' })
                ).toThrow('Amount exceeds balance');
            });
        });


        describe('and the amount is valid', () => {
            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 25;
                recipient = 'Darth Vader';
                transaction = wallet.createTransaction({ amount, recipient });
            });

            it('should create a Transaction object', () => {
                expect(transaction).toBeInstanceOf(Transaction);
            });

            it('should match the wallet inputMap', () => {
                expect(transaction.inputMap.address).toEqual(wallet.publicKey);
            });

            it('should output the amount to the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });

        describe('and a chain is supplied', () => {
            const chain = new Ledger();

            it('should call the Wallet.calculateBalance', () => {
                const calculateBalanceMockFn = vi.fn();

                // Save the real calculated balance
                const originalCalculateBalance = Wallet.calculateBalance;

                // Points the real calculateBalance to the mock function
                Wallet.calculateBalance = calculateBalanceMockFn;

                wallet.createTransaction({
                    recipient: 'Matteus',
                    amount: 30,
                    chain: chain.blocks
                });

                expect(calculateBalanceMockFn).toHaveBeenCalled();

                // Restore the original calculateBalance function
                Wallet.calculateBalance = originalCalculateBalance;
            });
        });

    });

    describe('Calculate the balance', () => {
        let ledger;

        beforeEach(() => {
            ledger = new Ledger();
        });

        // Fall 1.  När det inte finns några outputs(transaktioner)
        // för vår digitala plånbok...
        describe('and there is no output for the wallet', () => {
            it('should return the initial balance(starting balance)', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: ledger.blocks,
                        address: wallet.publicKey,
                    })
                ).toEqual(INITIAL_BALANCE);
            });
        });

        // Fall 2.  Det har skett förändring i plånboken...
        describe('and there are outputs/transactions for the wallet', () => {
            let transaction_1, transaction_2;

            beforeEach(() => {
                transaction_1 = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 10,
                });

                transaction_2 = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 20,
                });

                ledger.addBlock({ transactions: [transaction_1, transaction_2] });
            });

            it('should calculate the sum of all outputs(transactions) for the wallet', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: ledger.blocks,
                        address: wallet.publicKey,
                    })
                ).toEqual(
                    INITIAL_BALANCE +
                    transaction_1.outputMap[wallet.publicKey] +
                    transaction_2.outputMap[wallet.publicKey]
                );
            });

            describe('and the wallet has made a transaction', () => {
                let latestTransaction;

                beforeEach(() => {
                    latestTransaction = wallet.createTransaction({
                        recipient: 'Kalle',
                        amount: 25,
                        chain: ledger.blocks,
                    });

                    ledger.addBlock({ transactions: [latestTransaction] });
                });

                it('should return the amount from the latest transaction', () => {
                    expect(
                        Wallet.calculateBalance({
                            chain: ledger.blocks,
                            address: wallet.publicKey,
                        })
                    ).toEqual(latestTransaction.outputMap[wallet.publicKey]);
                });

                describe('and there are outputs next and after the recent transaction', () => {
                    let currentBlockTransaction, nextBlockTransaction;

                    beforeEach(() => {
                        latestTransaction = wallet.createTransaction({
                            recipient: 'Olle',
                            amount: 35,
                        });

                        // Belönings transaktionen...
                        currentBlockTransaction = Transaction.transactionReward({
                            miner: wallet,
                        });

                        // Placera ovanstående transaktioner i ett block i blockkedjan...
                        ledger.addBlock({
                            transactions: [latestTransaction, currentBlockTransaction],
                        });

                        // Skapa en ny transaktion...
                        nextBlockTransaction = new Wallet().createTransaction({
                            recipient: wallet.publicKey,
                            amount: 55,
                        });

                        ledger.addBlock({ transactions: [nextBlockTransaction] });
                    });

                    it('should include the amounts from the returned balance', () => {
                        expect(
                            Wallet.calculateBalance({
                                chain: ledger.blocks,
                                address: wallet.publicKey,
                            })
                        ).toEqual(
                            latestTransaction.outputMap[wallet.publicKey] +
                            currentBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        );
                    });

                });
            });
        });
    });

});