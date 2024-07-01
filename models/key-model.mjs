import { Schema, model } from 'mongoose';

// =============================================================
// Schema for mongoose
// =============================================================
const keySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// =============================================================
// Export the model
// =============================================================
export default model('Key', keySchema);