import { describe, it, expect, beforeEach } from "vitest";
import Wallet from "../models/Wallet.mjs";
import Transaction from "../models/Transaction.mjs";
import { verifySignature } from "../utilities/crypto-lib.mjs";
import { REWARD_ADDRESS, MINING_REWARD } from "../config/settings.mjs";

describe("Transaction", () => {
    let sender, recipient, amount, transaction;

    beforeEach(() => {
        sender = new Wallet();
        recipient = 'Matteus';
        amount = 50;
        transaction = new Transaction({ sender, recipient, amount });
    });

    describe('properties', () => {
        it('should have a property named id', () => {
            expect(transaction).toHaveProperty('id');
        });

        it('should have a property named outputMap', () => {
            expect(transaction).toHaveProperty('outputMap');
        });

        it('should have a property named inputMap', () => {
            expect(transaction).toHaveProperty('inputMap');
        });
    });

    describe('outputMap', () => {

        it('should display the recipients balance', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
            console.log(transaction.outputMap[recipient]);
        });

        it('should display the senders balance', () => {
            expect(transaction.outputMap[sender.publicKey]).toEqual(sender.balance - amount);
        });

    });

    describe('inputMap', () => {

        it('should have a property named timestamp', () => {
            expect(transaction.inputMap).toHaveProperty('timestamp');
        });

        it('should set the amount to the sender balance', () => {
            expect(transaction.inputMap.amount).toEqual(sender.balance);
        });

        it('should set the address to the sender public key', () => {
            expect(transaction.inputMap.address).toEqual(sender.publicKey);
        });

        it('should sign the input', () => {
            expect(verifySignature({
                publicKey: sender.publicKey,
                transaction: transaction.outputMap,
                signature: transaction.inputMap.signature
            })).toEqual(true);
        });

    });

    describe('Validating transactions', () => {

        describe('when the transaction is valid', () => {
            it('should return true', () => {
                expect(Transaction.validate({ transaction })).toBe(true);
            });
        });

        describe('when the transaction is invalid', () => {

            describe('and the transaction outputMap value is invalid', () => {
                it('should return false', () => {
                    transaction.outputMap[sender.publicKey] = 13373133133980232322231;
                    expect(Transaction.validate({ transaction })).toBe(false);
                });
            });

            describe('and the transaction inputMap signature is altered', () => {

                it('should return false', () => {
                    transaction.inputMap.signature = new Wallet().sign('not-good');
                    expect(Transaction.validate({ transaction })).toBe(false);
                });

            });

        });

    });

    describe('Update transaction', () => {
        let orgSignature, orgSenderOutput, nextRecipient, nextAmount;
        console.log('the transaction', transaction);

        describe('and the amount exceeds the balance', () => {
            it('should throw an error', () => {
                expect(() => {
                    transaction.update({ sender, recipient, amount: 50000 });
                }).toThrow('Amount exceeds balance');
            });
        });

        describe('and the amount is valid', () => {
            beforeEach(() => {
                orgSignature = transaction.inputMap.signature;
                orgSenderOutput = transaction.outputMap[sender.publicKey];
                nextAmount = 25;
                nextRecipient = 'Maximilian';

                transaction.update({ sender, recipient: nextRecipient, amount: nextAmount });
            });

            it('should display the amount for the next recipient', () => {
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
            });

            it('should withdraw the amount from the original sender output balance', () => {
                expect(transaction.outputMap[sender.publicKey]).toEqual(
                    orgSenderOutput - nextAmount
                );
            });

            it('should match the total output amount with the input amount', () => {
                expect(
                    Object.values(transaction.outputMap).reduce(
                        (total, amount) => total + amount
                    )
                ).toEqual(transaction.inputMap.amount);
            });

            it('should create a new signature for the transaction', () => {
                expect(transaction.inputMap.signature).not.toEqual(orgSignature);
            });


        });

    });


    describe('Transaction reward', () => {
        let transactionReward, miner;

        beforeEach(() => {
            miner = new Wallet();
            transactionReward = Transaction.transactionReward({ miner });
            console.log('the transaction reward', transactionReward);
        });

        it('should create a reward transaction with the address of the miner', () => {
            expect(transactionReward.inputMap).toEqual(REWARD_ADDRESS);
        });

        it('should create ONE and only ONE transaction with the MINING_REWARD', () => {
            expect(transactionReward.outputMap[miner.publicKey]).toEqual(
                MINING_REWARD
            );
        });
    });

});