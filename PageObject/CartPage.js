import { expect } from '@playwright/test';
class CartPage {
    constructor(page) {
        this.page = page;
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.buttonPlaceOrder = page.locator('div.actions a', {hasText:"Place Order "});
    }
   

    async verifyItemInCart(itemName) {

        const item = this.page.locator('div.cartSection h3', { hasText: itemName});        
        await expect(item).toBeVisible();
    }

    async clickCheckoutButton() {
        await this.checkoutButton.click();
        await this.buttonPlaceOrder.waitFor({ state: 'visible' });

    }   
}

module.exports = { CartPage };