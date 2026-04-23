import express from 'express';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import userRoutes from './Routes/UserRoutes.js';
import attendanceRoutes from './Routes/attendanceRoutes.js';
import planRoutes from './Routes/planRoutes.js';
import inquiryRoutes from './Routes/inquiryRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import { ENV } from './Config/env.js';
import connectDB from './Config/db.js';

const app  = express();
const PORT = ENV.PORT || 3200;

app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'ForgeFit API is running',
        docs: '/health'
    });
});

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'forgefit-api'
    });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/plans', planRoutes);
app.use('/inquiries', inquiryRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
