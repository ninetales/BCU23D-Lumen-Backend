import { describe, it, expect, beforeEach } from "vitest";
import Block from "../models/Block.mjs";
import { GENESIS_DATA, MINE_RATE } from "../config/settings.mjs";
import hexToBinary from "hex-to-binary";
import { generateHash } from "../utilities/crypto-lib.mjs";

describe('Block', () => {

    const timestamp = Date.now();
    const blockIndex = 1;
    const lastHash = '0';
    const hash = '0';
    const nonce = 1;
    const difficulty = 4;
    const transactions = { amount: 7, sender: 'Bruce Wayne', recipient: 'Tony Stark' };

    const block = new Block({
        timestamp,
        blockIndex,
        lastHash,
        hash,
        nonce,
        difficulty,
        transactions
    });


    describe('Properties', () => {
        it('should have the following properties: timestamp, blockIndex, hash, previousHash, transactions, nonce, difficulty', () => {
            expect(block).toHaveProperty('timestamp');
            expect(block).toHaveProperty('blockIndex');
            expect(block).toHaveProperty('hash');
            expect(block).toHaveProperty('lastHash');
            expect(block).toHaveProperty('nonce');
            expect(block).toHaveProperty('difficulty');
            expect(block).toHaveProperty('transactions');
        });

        it('should have a value for each property', () => {
            expect(block.timestamp).toEqual(timestamp);
            expect(block.blockIndex).toEqual(blockIndex);
            expect(block.hash).toEqual(hash);
            expect(block.lastHash).toEqual(lastHash);
            expect(block.nonce).toEqual(nonce);
            expect(block.difficulty).toEqual(difficulty);
            expect(block.transactions).toEqual(transactions);
        });
    });


    describe('Gensis Block', () => {
        const genesis = Block.genesis();

        it('should return an instance of the block class', () => {
            expect(genesis).toBeInstanceOf(Block);
        });

        it('should return the genesis data', () => {
            expect(genesis).toEqual(GENESIS_DATA)
        });
    });

    describe('mineBlock()', () => {
        let lastBlock, minedBlock, transactions;

        beforeEach(() => {
            lastBlock = Block.genesis();
            transactions = { amount: 7, sender: 'Bruce Wayne', recipient: 'Tony Stark' };
            minedBlock = Block.mineBlock({ lastBlock, transactions });
        });

        it('should return an instance of the Block class', () => {
            expect(minedBlock).toBeInstanceOf(Block);
        });

        it('should add a timestamp to the block', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('should set the lasthash to match the last block hash', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('should set the transactions', () => {
            expect(minedBlock.transactions).toEqual(transactions);
        });

        it('should produce a hash the meets the difficulty level', () => {
            expect(
                hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
            ).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('should produce a hash based on the correct inputMap', () => {
            expect(minedBlock.hash).toEqual(
                generateHash(
                    minedBlock.timestamp,
                    minedBlock.lastHash,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    transactions
                )
            );
        });


    });

    describe('regulateDifficulty()', () => {

        it('should increase the difficulty for quickly mined blocks', () => {
            expect(Block.regulateDifficulty({
                block,
                timestamp: block.timestamp + MINE_RATE - 100,
            })).toEqual(block.difficulty + 1);
        });

        it('should decrease the difficulty for slowly mined blocks', () => {
            expect(Block.regulateDifficulty({
                block,
                timestamp: block.timestamp + MINE_RATE + 100,
            })).toEqual(block.difficulty - 1);
        });

    });

});