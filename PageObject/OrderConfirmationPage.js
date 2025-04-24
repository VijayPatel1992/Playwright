const { expect } = require('@playwright/test');

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.titleLocator = page.locator('table#htmlData tr table.order-summary tr td div.title');
    }

    async getAllTitleTexts() {
        this.titleLocator.first().waitFor({ state: 'visible' }); // Wait for the title locator to be visible
        await this.page.waitForTimeout(2000); // Optional: Wait for 2 seconds to ensure the page is fully loaded
        return await this.titleLocator.allTextContents(); // Retrieves text content from all matching elements
    }

}

module.exports = { OrderConfirmationPage };