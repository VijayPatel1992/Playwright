import { createLogger, format, transports } from 'winston';
import path from 'path';

// Define the log file path
const logFilePath = path.join(__dirname, '../Loging/app.log');

// Create a Winston logger instance
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: logFilePath }),
        new transports.Console()
    ]
});

// Create a function to generate a logger for each test case
export function getTestLogger(testName: string) {
    const logFilePath = path.join(__dirname, `../Loging/${testName}.log`);

    return createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            new transports.File({ filename: logFilePath }),
            new transports.Console()
        ]
    });
}

export default logger;
