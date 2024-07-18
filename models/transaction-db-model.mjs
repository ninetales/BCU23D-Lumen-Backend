import { Schema } from "mongoose";

const TransactionSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    inputMap: {
        type: Object,
        required: true
    },
    outputMap: {
        type: Object,
        required: true
    }
}, { _id: false });

export default TransactionSchema;