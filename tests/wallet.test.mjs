import { describe, it, expect } from 'vitest';
import Wallet from '../models/Wallet.mjs';
import { generateKeys } from '../utilities/crypto-lib.mjs';

describe('Wallet', () => {

    const wallet = new Wallet();

    it('should be an instance of Wallet', () => {
        expect(wallet).toBeInstanceOf(Wallet);
    });

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