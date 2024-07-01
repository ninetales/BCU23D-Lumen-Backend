import { describe, it, expect } from 'vitest';
import { generateHash, generateKeys, verifySignature } from '../utilities/crypto-lib.mjs';

describe('Hashing', () => {

    it('should produce a hash with supplied arguments', () => {
        expect(generateHash('Ash', 'Kechum')).toEqual(generateHash('Ash', 'Kechum'));
    });

    it('should produce a hash with supplied arguments in any order', () => {
        expect(generateHash('Ash', 'Kechum')).toEqual(generateHash('Kechum', 'Ash'));
    });

    it('should generate a unique hash for different arguments', () => {
        const obj = {};
        const originalHash = generateHash(obj);
        obj['name'] = 'Ash';

        expect(generateHash(obj)).not.toEqual(originalHash);
    });

});

describe('Keys', () => {

    const data = { name: 'Ash', pokemon: 'Pikachu' };
    const { keyPair, publicKey } = generateKeys();

    it('should verify a signature with correct private key', () => {
        const signature = keyPair.sign(generateHash(data));
        const isVerified = verifySignature({ publicKey, data, signature });
        expect(isVerified).toBeTruthy();
    });

    it('should fail to verify with incorrect private key', () => {
        const { keyPair } = generateKeys(); // Generate new keys
        const signature = keyPair.sign(generateHash(data));
        const isVerified = verifySignature({ publicKey, data, signature }); // Use old public key

        expect(isVerified).toBeFalsy();
    });

});