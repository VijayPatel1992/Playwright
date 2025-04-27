class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.titleLocator = page.locator('table#htmlData tr table.order-summary tr td div.title');
    }

    async getAllTitleTexts() {
        try {
            // Wait for the page to be ready and get all titles
            // Get all title elements
            const titles = await this.titleLocator.allTextContents();            
            // Validate we got some titles
            if (!titles || titles.length === 0) {
                throw new Error('No order titles found on the page');
            }
            
            return titles;
        } catch (error) {
            console.error('Failed to get order confirmation details:', error.message);
            // Capture screenshot on failure
            await this.page.screenshot({ 
                path: `./test-results/order-confirmation-failure-${Date.now()}.png`,
                fullPage: true 
            });
            throw new Error(`Order confirmation retrieval failed: ${error.message}`);
        }
    }
}

module.exports = { OrderConfirmationPage };