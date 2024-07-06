import { INITIAL_BALANCE } from "../config/settings.mjs";
import { generateKeys } from "../utilities/crypto-lib.mjs";

const { privateKey, publicKey } = generateKeys();

export default class Wallet {

    constructor() {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.balance = INITIAL_BALANCE;
    };

}