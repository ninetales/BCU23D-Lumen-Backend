import { addBlockToDb } from "../services/block-services.mjs";
import { getLedgerFromDb, updateLedgerInDb } from "../services/ledger-services.mjs";
import Block from "./Block.mjs";
import { generateHash } from "../utilities/crypto-lib.mjs";

export default class Ledger {

    constructor({ userId } = {}) {
        this.userId = userId;
        this.blocks = [Block.genesis()];
    }

    setUserId({ userId }) {
        this.userId = userId;
    }

    updateMemLedger({ ledger }) {
        this.blocks = ledger.blocks;
        // todo: update the database
    }

    async addBlock({ transactions }) {
        const lastBlock = this.blocks.at(-1);
        const newBlock = Block.mineBlock({ lastBlock, transactions });
        this.blocks.push(newBlock);
        await addBlockToDb({ userId: this.userId, newBlock });
        return newBlock;
    }

    /**
     * Replace the current ledger with a new ledger
     * @param {*} newLedger 
     */
    async replace({ newLedger }) {
        // const ledger = await Ledger.get({ userId });

        if (this.blocks.length >= newLedger.length) return;
        console.log('The stage 1 - completed');

        if (!this.validateLedger(newLedger)) return;
        console.log('The stage 2 - completed');

        this.blocks = newLedger;
        console.log('The mem ledger should be updated', this.blocks);

        const updatedLedger = await updateLedgerInDb({ userId: this.userId, blocks: this.blocks });

        console.log('The new updated ledger', updatedLedger);
    }

    // /**
    //  * @desc Get the ledger of the authenticated user
    //  * @returns 
    //  */
    // // just get the local ledger
    // static get({ userId }) {
    //     return await getLedgerFromDb(userId);
    // }

    /**
     * @desc Validate the ledger
     * @param {*} ledger 
     */
    validateLedger(blocks) {
        if (JSON.stringify(blocks.at(0)) !== JSON.stringify(Block.genesis())) return false;
        console.log('Past validation stage 1');

        for (let i = 1; i < blocks.length; i++) {
            console.log(`Iteration ${i} out of ${blocks.length}`);
            const { timestamp, lastHash, hash, nonce, difficulty, transactions } = blocks.at(i);
            const currentLastHash = blocks[i - 1].hash;
            const lastDifficulty = blocks[i - 1].difficulty;

            if (lastHash !== currentLastHash) return false;
            console.log('The hash is OK');

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
            console.log('The difficulty is OK');

            const validHash = generateHash(
                timestamp,
                lastHash,
                transactions,
                nonce,
                difficulty
            );
            if (hash !== validHash) return false;
            console.log('The hash is valid');
        }

        console.log('Validation passed');
        return true;
    }
}