import { expect, Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;
    private readonly checkoutButton: Locator;
    private readonly buttonPlaceOrder: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.buttonPlaceOrder = page.locator('div.actions a', { hasText: "Place Order " });
    }

    // Verifies if a specific item is present in the cart
    async verifyItemInCart(itemName: string): Promise<void> {
        try {
            const item = this.page.locator('div.cartSection h3', { hasText: itemName });
            await expect(item, `Item "${itemName}" should be visible in cart`).toBeVisible();
        } catch (error: any) {
            console.error('Cart verification failed:', error.message);
            await this.page.screenshot({ 
                path: `./test-results/cart-verification-failure-${Date.now()}.png`,
                fullPage: true 
            });
            throw error;
        }
    }

    // Clicks the checkout button and verifies the visibility of the Place Order button
    async clickCheckoutButton(): Promise<void> {
        try {
            await this.checkoutButton.click();
            await expect(this.buttonPlaceOrder, 'Place Order button should be visible after checkout').toBeVisible();
        } catch (error: any) {
            console.error('Checkout process failed:', error.message);
            await this.page.screenshot({ 
                path: `./test-results/checkout-failure-${Date.now()}.png`,
                fullPage: true 
            });
            throw new Error(`Checkout process failed: ${error.message}`);
        }
    }
}