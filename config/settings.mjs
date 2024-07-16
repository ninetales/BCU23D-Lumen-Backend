export const INITIAL_BALANCE = 500;
export const MINE_RATE = 500000;
export const MINING_REWARD = 20;
export const REWARD_ADDRESS = { address: 'reward-address' };
const INITIAL_DIFFICULTY = 4;

export const GENESIS_DATA = {
    timestamp: 1,
    blockIndex: 1,
    lastHash: '0',
    hash: '0',
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY,
    transactions: []
}