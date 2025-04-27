class ScreenshotOnFailure {
    /**
     * Captures a screenshot in case of test failure.
     * @param {string} testName - The name of the test.
     * @param {string} outputDir - The directory to save the screenshot.
     */
    static async captureScreenshotOnFailure(testName, outputDir) {
        const { chromium } = require('playwright');
        const path = require('path');

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
}

module.exports = ScreenshotOnFailure;