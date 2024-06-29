import './globals.mjs';
import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './config/db-conn.mjs';
import cors from 'cors';
import logger from './middleware/logger.mjs';
import authRouter from './routes/auth-routes.mjs';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { errorHandler } from './middleware/error-handler.mjs';

dotenv.config({ path: './config/.env' });

// Connect to MongoDB
dbConnect();

const app = express();
const MODE = process.env.MODE;
const PORT = process.env.PORT || 5001;

if (process.env.MODE === 'development') {
    app.use(logger);
}

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

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running in ${MODE} mode on port ${PORT}`);
});