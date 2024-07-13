import { describe, it, expect } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import { verifySignature } from '../utilities/crypto-lib.mjs';

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

});