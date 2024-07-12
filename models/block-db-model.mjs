import { Schema, model } from "mongoose";
import TransactionSchema from "./transaction-db-model.mjs";

const BlockSchema = new Schema({
    _id: false,
    timestamp: {
        type: Number,
        required: true
    },
    blockIndex: {
        type: Number,
        required: true
    },
    lastHash: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    nonce: {
        type: Number,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    },
    transactions: [{
        type: TransactionSchema,
        required: true
    }]
});

export default BlockSchema;