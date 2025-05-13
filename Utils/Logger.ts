import { createLogger, format, transports } from 'winston';
import winston from 'winston';
import path from 'path';
import { promises as fsPromises, constants } from 'fs';

// Corrected directory name
const logDir = path.join(__dirname, '../Logging');
const consolidatedLogPath = path.join(logDir, 'consolidated.log');

// Safe file deletion
async function safeUnlink(filePath: string): Promise<void> {
    try {
        await fsPromises.access(filePath, constants.F_OK);
        await fsPromises.unlink(filePath);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            console.warn(`⚠️ File not found: ${filePath}`);
        } else {
            console.error(`❌ Error deleting ${filePath}:`, err);
        }
    }
}

import fs from 'fs';

export async function mergeLogs(): Promise<void> {
    try {
        const consolidatedLogPath = path.join(logDir, 'consolidated.log');
        const backupLogPath = path.join(logDir, 'consolidated_backup.log');
        let consolidatedLogs = '';

        // Backup the existing file
        try {
            await fs.promises.copyFile(consolidatedLogPath, backupLogPath);
            console.log('🔄 Backup created for consolidated.log');
        } catch (backupErr) {
            console.warn('⚠️ Warning: Failed to create backup, continuing...');
        }

        // Read all log files and merge their contents
        const files = await fs.promises.readdir(logDir);
        for (const file of files) {
            if (file !== 'consolidated.log' && file !== 'app.log') {
                const filePath = path.join(logDir, file);
                try {
                    const content = await fs.promises.readFile(filePath, 'utf8');
                    consolidatedLogs += `\n=== Logs from ${file} ===\n${content}\n`;
                } catch (readErr) {
                    console.error(`❌ Failed to read ${file}:`, readErr);
                }
            }
        }

        // Write the merged logs to consolidated.log
        try {
            await fs.promises.writeFile(consolidatedLogPath, consolidatedLogs, 'utf8');
            console.log('✅ Logs consolidated successfully');
        } catch (writeErr) {
            console.error('❌ Error writing to consolidated.log, restoring backup...', writeErr);
            await fs.promises.copyFile(backupLogPath, consolidatedLogPath);
            console.log('✅ Backup restored');
        }

    } catch (err) {
        console.error('❌ Error during log consolidation:', err);
    }
}

// Winston base logger (for app)
const logFilePath = path.join(logDir, 'app.log');
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new winston.transports.File({ filename: logFilePath }),
        new winston.transports.Console()
    ]
});

// Ensure that the default logger has at least one transport
if (logger.transports.length === 0) {
    logger.add(new winston.transports.Console());
    console.warn('⚠️ Default logger had no transports. Added Console transport.');
}

// Logger per test file
export function getTestLogger(testName: string) {
    const testLogPath = path.join(logDir, `${testName}.log`);

    const testLogger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
        ),
        transports: [
            new transports.File({ filename: testLogPath }),
            new transports.Console()
        ]
    });

    // Ensure the test logger has at least one transport
    if (testLogger.transports.length === 0) {
        testLogger.add(new transports.Console());
        console.warn(`⚠️ Test logger for ${testName} had no transports. Added Console transport.`);
    }

    console.debug(`🛠️ Creating test logger for: ${testName}`);
    console.debug(`🛠️ Initial transports for test logger: ${testLogger.transports.length}`);

    return testLogger;
}

// Clean log folder before tests (deletes all logs)
export async function cleanLoggingFolder(): Promise<void> {
    try {
        const files = await fsPromises.readdir(logDir);
        for (const file of files) {
            const filePath = path.join(logDir, file);

            if (file === 'app.log') {
                // ❗ Clear contents of app.log instead of deleting it
                await fsPromises.writeFile(filePath, '', 'utf8');
                console.log('🧹 Cleared contents of app.log');
                continue;
            }

            await safeUnlink(filePath);
        }

        console.log('✅ Logging folder cleaned (app.log contents cleared but file kept)');
    } catch (err) {
        console.error('❌ Error while cleaning logging folder:', err);
    }
}

// Clean log folder after merging (keep app.log and consolidated.log)
export async function cleanLoggingFolderAfterMerging(): Promise<void> {
    try {
        const consolidatedLogPath = path.join(logDir, 'consolidated.log');
        
        // Read and log contents of consolidated.log before cleanup
        try {
            const dataBefore = await fsPromises.readFile(consolidatedLogPath, 'utf8');
        } catch (err) {
            console.error('❌ Error reading consolidated.log before cleanup:', err);
        }

        // Proceed with cleaning the logging folder
        const files = await fsPromises.readdir(logDir);
        for (const file of files) {
            if (file !== 'consolidated.log' && file !== 'app.log') {
                const filePath = path.join(logDir, file);
                await safeUnlink(filePath);
            }
        }

        console.log('✅ Logging folder cleaned after merging (app.log and consolidated.log kept)');
    } catch (err) {
        console.error('❌ Error while cleaning logging folder:', err);
    }
}

export default logger;
