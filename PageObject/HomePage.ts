import { Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;
    private readonly viewButton: Locator;
    private readonly cartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.viewButton = page.getByRole('button', { name: 'View' }).nth(2);
        this.cartButton = page.locator("button[routerlink='/dashboard/cart']");
    }    // Clicks on the cart button to navigate to the cart page
    async ClickOnCartButton(): Promise<void> {
        try {
            console.log('Attempting to click cart button');
            await this.cartButton.waitFor({ state: 'visible' });
            await this.cartButton.click();
            console.log('Successfully clicked cart button');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to click cart button:', error.message);
                await this.page.screenshot({
                    path: `./test-results/cart-navigation-failed-${Date.now()}.png`
                });
                throw new Error(`Cart navigation failed: ${error.message}`);
            }
            throw error;
        }
    }
}