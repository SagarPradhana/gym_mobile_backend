import mongoose from 'mongoose';
import { ENV } from './env.js';

mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        if (!ENV.MONGO_URI) {
            throw new Error('MONGO_URI is missing');
        }

        const conn = await mongoose.connect(ENV.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log("mongoose.connection.readyState", mongoose.connection.readyState);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
};

export default connectDB;
