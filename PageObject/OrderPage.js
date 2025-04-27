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

        // Configure retry settings
        this.retryCount = 3;
        this.retryDelay = 1000; // 1 second
    }

    // Retries an action multiple times in case of failure
    async retry(action, errorMessage) {
        let lastError;
        for (let attempt = 1; attempt <= this.retryCount; attempt++) {
            try {
                return await action();
            } catch (error) {
                lastError = error;
                console.log(`Attempt ${attempt} failed: ${error.message}`);
                if (attempt < this.retryCount) {
                    await this.page.waitForTimeout(this.retryDelay);
                }
            }
        }
        throw new Error(`${errorMessage}. Failed after ${this.retryCount} attempts. Last error: ${lastError.message}`);
    }

    // Fills in payment details and places the order
    async FillPaymentDetails() {
        try {
            // Ensure credit card field is ready
            await this.retry(async () => {
                await this.textBoxCreditCardNumber.waitFor({ state: 'visible', timeout: 10000 });
                await this.textBoxCreditCardNumber.fill('4111111111111111');
            }, 'Failed to fill credit card number');

            // Fill CVV with validation
            await this.retry(async () => {
                await this.textBoxCVVCode.waitFor({ state: 'visible' });
                await this.textBoxCVVCode.fill('123');
                const cvvValue = await this.textBoxCVVCode.inputValue();
                if (cvvValue !== '123') throw new Error('CVV verification failed');
            }, 'Failed to fill CVV code');

            // Handle country selection with improved reliability
            await this.retry(async () => {
                await this.textBoxCountry.waitFor({ state: 'visible' });
                await this.textBoxCountry.clear();
                await this.textBoxCountry.type('India', { delay: 100 });
                
                const countryOption = this.page.locator("//input[@placeholder='Select Country']/following-sibling::section//span[normalize-space(text())='India']");
                await countryOption.waitFor({ state: 'visible', timeout: 5000 });
                await countryOption.click();
            }, 'Failed to select country');

            // Verify country selection before proceeding
            await this.retry(async () => {
                const selectedCountry = await this.textBoxCountry.inputValue();
                if (!selectedCountry.includes('India')) {
                    throw new Error('Country selection verification failed');
                }
            }, 'Failed to verify country selection');

            // Handle place order with confirmation
            await this.retry(async () => {
                await this.ButtonPlaceOrder.waitFor({ state: 'visible' });
                await expect(this.ButtonPlaceOrder).toBeEnabled();
                await this.ButtonPlaceOrder.click();
            }, 'Failed to click Place Order button');

            // Wait for order confirmation with timeout
            await this.retry(async () => {
                await this.OrderConfirmation.waitFor({ 
                    state: 'visible',
                    timeout: 15000 
                });
                await expect(this.OrderConfirmation).toBeVisible();
            }, 'Order confirmation message did not appear');

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