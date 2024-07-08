import { Schema, model } from 'mongoose';
import BlockSchema from './block-db-model.mjs';

const ledgerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blocks: [{
        type: BlockSchema,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Ledger', ledgerSchema);