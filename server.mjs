import './globals.mjs';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from './middleware/logger.mjs';

dotenv.config({ path: './config/.env' });

const app = express();
const MODE = process.env.MODE;
const PORT = process.env.PORT || 5001;

if (process.env.MODE === 'development') {
    app.use(logger);
}

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running in ${MODE} mode on port ${PORT}`);
});