import hexToBinary from "hex-to-binary";
import { GENESIS_DATA, MINE_RATE } from "../config/settings.mjs";
import { generateHash } from "../utilities/crypto-lib.mjs";

/**
 * @desc Class to represent a block in the blockchain
 */
export default class Block {

    constructor({ timestamp, lastHash, hash, nonce, difficulty, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.data = data;
    }

    /**
     * @desc Method to generate the genesis block
     */
    static genesis() {
        return new this(GENESIS_DATA);
    };

    /**
     * @desc Method to mine a new block
     * @returns {Block} a new block
     */
    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        let nonce = 0;
        let { difficulty } = lastBlock;
        const lastHash = lastBlock.hash;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.regulateDifficulty({
                block: lastBlock,
                timestamp
            });
            hash = generateHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data
        });
    };

    /**
     * @desc Method to regulate the difficulty of the block
     * @returns {number} the difficulty of the block
     */
    static regulateDifficulty({ block, timestamp }) {
        const { difficulty } = block;
        if (timestamp - block.timestamp > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    };

}