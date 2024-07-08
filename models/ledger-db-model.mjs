import { Schema, model } from 'mongoose';

const ledgerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ledger: [{
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
        data: [{
            type: Array,
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Ledger', ledgerSchema);