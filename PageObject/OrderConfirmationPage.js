const { expect } = require('@playwright/test');

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.titleLocator = page.locator('table#htmlData tr table.order-summary tr td div.title');
    }

    async getAllTitleTexts() {
        return await this.titleLocator.allTextContents(); // Retrieves text content from all matching elements
    }

}

module.exports = { OrderConfirmationPage };