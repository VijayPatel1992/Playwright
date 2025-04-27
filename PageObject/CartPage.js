import { expect } from '@playwright/test';

class CartPage {
    constructor(page) {
        this.page = page;
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.buttonPlaceOrder = page.locator('div.actions a', { hasText: "Place Order " });
    }

    async verifyItemInCart(itemName) {
        try {
            const item = this.page.locator('div.cartSection h3', { hasText: itemName });
            await expect(item, `Item "${itemName}" should be visible in cart`).toBeVisible();
        } catch (error) {
            console.error('Cart verification failed:', error.message);
            await this.page.screenshot({ 
                path: `./test-results/cart-verification-failure-${Date.now()}.png`,
                fullPage: true 
            });
            throw error;
        }
    }

    async clickCheckoutButton() {
        try {
            await this.checkoutButton.click();
            await expect(this.buttonPlaceOrder, 'Place Order button should be visible after checkout').toBeVisible();

        } catch (error) {
            console.error('Checkout process failed:', error.message);
            await this.page.screenshot({ 
                path: `./test-results/checkout-failure-${Date.now()}.png`,
                fullPage: true 
            });
            throw new Error(`Checkout process failed: ${error.message}`);
        }
    }
}

module.exports = { CartPage };