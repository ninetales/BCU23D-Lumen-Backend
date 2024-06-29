import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch {
        console.log('Error connecting to MongoDB');
    }
};