import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
};

export default connectDB;
