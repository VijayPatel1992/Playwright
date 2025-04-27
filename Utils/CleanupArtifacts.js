const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Deletes files older than the specified number of days in a given directory.
 * @param {string} dirPath - The directory to clean up.
 * @param {number} days - The age of files to delete (in days).
 */
function deleteOldFiles(dirPath, days) {
    const now = Date.now();
    const ageLimit = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    if (!fs.existsSync(dirPath)) {
        console.warn(`Directory not found: ${dirPath}`);
        return;
    }

    fs.readdirSync(dirPath).forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtimeMs > ageLimit) {
            if (stats.isDirectory()) {
                fs.rmdirSync(filePath, { recursive: true });
                console.log(`Deleted directory: ${filePath}`);
            } else {
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
            }
        }
    });
}

/**
 * Captures a screenshot in case of test failure.
 * @param {string} testName - The name of the test.
 * @param {string} outputDir - The directory to save the screenshot.
 */
async function captureScreenshotOnFailure(testName, outputDir) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Simulate test failure scenario
        throw new Error('Simulated test failure');
    } catch (error) {
        const screenshotPath = path.join(outputDir, `${testName}-failure.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot captured: ${screenshotPath}`);
    } finally {
        await browser.close();
    }
}

// Example usage
const directoriesToClean = [
    path.join(__dirname, '../test-results'),
    path.join(__dirname, '../allure-results'),
    path.join(__dirname, '../playwright-report')
];

const daysToKeep = 7; // Keep files for 7 days

directoriesToClean.forEach(dir => deleteOldFiles(dir, daysToKeep));

module.exports = { deleteOldFiles, captureScreenshotOnFailure };