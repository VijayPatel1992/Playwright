import { Page, Locator } from '@playwright/test';

export class OrderConfirmationPage {
    private readonly page: Page;
    private readonly titleLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleLocator = page.locator('table#htmlData tr table.order-summary tr td div.title');
    }

    // Retrieves all title texts from the order confirmation page
    async getAllTitleTexts(): Promise<string[]> {
        try {
            console.log('Attempting to retrieve order confirmation titles');
            // Wait for the page to be ready and get all titles
            await this.titleLocator.first().waitFor({ state: 'visible' });
            // Get all title elements
            const titles = await this.titleLocator.allTextContents();            
            // Validate we got some titles
            if (!titles || titles.length === 0) {
                throw new Error('No order titles found on the page');
            }
            
            console.log(`Retrieved ${titles.length} order titles`);
            return titles;        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to get order confirmation details:', error.message);
                // Capture screenshot on failure
                await this.page.screenshot({ 
                    path: `./test-results/order-confirmation-failure-${Date.now()}.png`,
                    fullPage: true 
                });
                throw new Error(`Order confirmation retrieval failed: ${error.message}`);
            }
            throw error;
        }
    }
}