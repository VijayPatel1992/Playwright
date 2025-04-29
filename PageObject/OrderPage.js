const { expect } = require('@playwright/test');

class OrderPage {
    constructor(page) {
        this.page = page;

        // Selectors
        this.textBoxCreditCardNumber = page.locator('xpath=//div[text()="Credit Card Number "]/..//input');        
        this.textBoxCVVCode = page.locator('xpath=//div[text()="CVV Code "]/..//input');        
        this.textBoxCountry = page.locator('input[placeholder="Select Country"]');
        this.ButtonPlaceOrder = page.locator("a:has-text('Place Order')");
        this.OrderConfirmation = page.getByRole('heading', { name: 'Thankyou for the order.' });
    }

    // Fills in payment details and places the order
    async FillPaymentDetails() {
        try {
            // Fill credit card details
            await this.textBoxCreditCardNumber.waitFor({ state: 'visible', timeout: 10000 });
            await this.textBoxCreditCardNumber.fill('4111111111111111');

            // Fill CVV
            await this.textBoxCVVCode.waitFor({ state: 'visible' });
            await this.textBoxCVVCode.fill('123');
            const cvvValue = await this.textBoxCVVCode.inputValue();
            if (cvvValue !== '123') throw new Error('CVV verification failed');

            // Handle country selection
            await this.textBoxCountry.waitFor({ state: 'visible' });
            await this.textBoxCountry.clear();
            await this.textBoxCountry.type('India', { delay: 100 });
            
            const countryOption = this.page.locator("//input[@placeholder='Select Country']/following-sibling::section//span[normalize-space(text())='India']");
            await countryOption.waitFor({ state: 'visible', timeout: 5000 });
            await countryOption.click();

            // Verify country selection
            const selectedCountry = await this.textBoxCountry.inputValue();
            if (!selectedCountry.includes('India')) {
                throw new Error('Country selection verification failed');
            }

            // Place order
            await this.ButtonPlaceOrder.waitFor({ state: 'visible' });
            await expect(this.ButtonPlaceOrder).toBeEnabled();
            await this.ButtonPlaceOrder.click();

            // Wait for order confirmation
            await this.OrderConfirmation.waitFor({ 
                state: 'visible',
                timeout: 15000 
            });
            await expect(this.OrderConfirmation).toBeVisible();

        } catch (error) {
            console.error('Payment process failed:', error.message);
            // Capture screenshot on failure
            await this.page.screenshot({ 
                path: `./test-results/payment-failure-${Date.now()}.png`,
                fullPage: true 
            });
            throw new Error(`Payment process failed: ${error.message}`);
        }
    }
}

module.exports = { OrderPage };