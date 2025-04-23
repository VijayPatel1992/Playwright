const { expect } = require('@playwright/test');

class OrderPage {
    constructor(page) {
        this.page = page;

        // Selectors
        this.textBoxCreditCardNumber  = page.locator('xpath=//div[text()="Credit Card Number "]/..//input');        
        this.textBoxCVVCode  = page.locator('xpath=//div[text()="CVV Code "]/..//input');        
        this.textBoxCountry  = page.locator('input[placeholder="Select Country"]');
        this.ButtonPlaceOrder = page.locator("a:has-text('Place Order')");
        this.OrderConfirmation =page.getByRole('heading', { name: 'Thankyou for the order.' })
    }

    async FillPaymentDetails() {
        await this.textBoxCreditCardNumber.fill('4111111111111111'); // Example credit card number
        await this.textBoxCVVCode.fill('123');
        await this.textBoxCountry.type('India', { delay: 100 });
        await this.page.locator("//input[@placeholder='Select Country']/following-sibling::section//span[normalize-space(text())='India']").click(); // Select India from the dropdown
        await this.page.waitForTimeout(2000); // Wait for 2 seconds to simulate user typing
        await this.ButtonPlaceOrder.click();        
        await this.OrderConfirmation.waitFor({ state: 'visible' });        
    }

  

   
}

module.exports = { OrderPage };