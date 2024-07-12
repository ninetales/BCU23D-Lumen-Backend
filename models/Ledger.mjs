import { addBlockToDb } from "../services/block-services.mjs";
import { getLedgerFromDb, updateLedgerInDb } from "../services/ledger-services.mjs";
import Block from "./Block.mjs";
import { generateHash } from "../utilities/crypto-lib.mjs";

export default class Ledger {

    static async addBlock({ userId, ledger, transactions }) {
        const lastBlock = ledger.blocks.at(-1);
        const newBlock = Block.mineBlock({ lastBlock, transactions });
        await addBlockToDb({ userId, newBlock });
        return newBlock;
    }

    /**
     * Replace the current ledger with a new ledger
     * @param {*} newLedger 
     */
    static async replace({ userId, newLedger }) {
        const ledger = await Ledger.get({ userId });

        if (ledger.blocks.length >= newLedger.blocks.length) return;
        console.log('The stage 1 - completed');

        if (!Ledger.validateLedger(newLedger)) return;
        console.log('The stage 2 - completed');

        const updatedLedger = updateLedgerInDb({ userId, ledger: newLedger });

        console.log('The new updated ledger', updatedLedger);
    }

    /**
     * @desc Get the ledger of the authenticated user
     * @returns 
     */
    static async get({ userId }) {
        return await getLedgerFromDb(userId);
    }

    /**
     * @desc Validate the ledger
     * @param {*} ledger 
     */
    static validateLedger(ledger) {
        if (JSON.stringify(ledger.blocks.at(0)) !== JSON.stringify(Block.genesis())) return false;
        console.log('Past validation stage 1');

        for (let i = 1; i < ledger.blocks.length; i++) {
            console.log(`Iteration ${i} out of ${ledger.blocks.length}`);
            const { timestamp, lastHash, hash, nonce, difficulty, transactions } = ledger.blocks.at(i);
            const currentLastHash = ledger.blocks[i - 1].hash;
            const lastDifficulty = ledger.blocks[i - 1].difficulty;

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