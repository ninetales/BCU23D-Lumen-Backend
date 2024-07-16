import { Schema, model } from "mongoose";

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
        type: Object,
        required: true
    }]
});

export default BlockSchema;