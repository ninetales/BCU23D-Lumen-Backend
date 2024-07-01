import crypto from 'crypto';
import pkg from 'elliptic';

const { ec } = pkg;

/**
 * @desc   Generate a hash from a list of arguments
 * @param  {...any} args - List of arguments to hash
 * @returns {string} - Hashed string 
 */
export const generateHash = (...args) => {
    return crypto
        .createHash('sha256')
        .update(
            args
                .map((arg) => JSON.stringify(arg))
                .sort()
                .join('')
        )
        .digest('hex');
}

export const ellipticHash = new ec('secp256k1');

export const verifySignature = ({ publicKey, data, signature }) => {
    const key = ellipticHash.keyFromPublic(publicKey, 'hex');
    return key.verify(generateHash(data), signature);
};

/**
 * @desc Generate an object containing a key pair, public key, and private key
 * @returns {Object} An object containing the key pair, public key, and private key
 */
// TODO: Perhaps encrypt the keys before returning them
export const generateKeys = () => {
    const keyPair = ellipticHash.genKeyPair();
    return {
        keyPair,
        publicKey: keyPair.getPublic('hex'),
        privateKey: keyPair.getPrivate('hex'),
    }
}
