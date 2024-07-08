import { addBlockToDb } from "../services/block-services.mjs";
import Block from "./Block.mjs";

export default class Ledger {

    static async addBlock({ userId, ledger, data }) {
        const lastBlock = ledger.blocks.at(-1);
        const newBlock = Block.mineBlock({ lastBlock, data });
        await addBlockToDb({ userId, newBlock });
        return newBlock;
    }
}