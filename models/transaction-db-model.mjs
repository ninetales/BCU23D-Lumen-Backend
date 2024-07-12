import { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
    _id: false,
    dummy: {
        type: Object
    }
});

export default TransactionSchema;