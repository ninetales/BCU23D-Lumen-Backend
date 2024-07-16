import './globals.mjs';
import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './config/db-conn.mjs';
import cors from 'cors';
import logger from './middleware/logger.mjs';
import authRouter from './routes/auth-routes.mjs';
import blockRouter from './routes/block-routes.mjs';
import ledgerRouter from './routes/ledger-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { errorHandler } from './middleware/error-handler.mjs';
import WSServer from './ws-server.mjs';
import Wallet from './models/Wallet.mjs';
import MemPool from './models/MemPool.mjs';
import Ledger from './models/Ledger.mjs';

dotenv.config({ path: './config/.env' });

export const wallet = new Wallet();
export const ledger = new Ledger();
export const memPool = new MemPool();
export const wsServer = new WSServer();

// Connect to MongoDB
dbConnect();

const app = express();
const MODE = process.env.MODE;
const PORT = process.env.PORT || 4001;

if (process.env.MODE === 'development') {
    app.use(logger);
}

wsServer.listen();

// Broadcast the ledger every second
// setTimeout(() => {
//     wsServer.broadcast();
// }, 1000);

// Body parser
app.use(express.json());

// Remove NO-SQL injection
app.use(mongoSanitize());

// Add security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Limit requests from the API (DDOS protection)
const limit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes window
    limit: 100,
});

app.use(limit);

// Activate CORS()
app.use(cors());

// Prevent HPP attacks (http parameter pollution)
app.use(hpp());

// Endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/block', blockRouter);
app.use('/api/v1/ledger', ledgerRouter);
app.use('/api/v1/wallet', transactionRouter);

app.use(errorHandler)

const server = app.listen(PORT, () => {
    console.log(`Server is running in ${MODE} mode on port ${PORT}`);
});

/**
 * @desc This is a global error (rejections) handler
 * @param {Error} err - The error object
 * @param {Promise} promise - The promise object
 */
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});