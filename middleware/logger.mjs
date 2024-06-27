import fs from 'fs';
import path from 'path';

const logger = (req, res, next) => {
    const filepath = path.join(__dirname, 'logs', 'app.log');
    const message = `[${new Date().toLocaleDateString('sv-SE')}] [${new Date().toLocaleTimeString('sv-SE')}] - ${req.method} ${req.originalUrl}\n`;
    fs.appendFileSync(filepath, message);

    next();
}

export default logger;