import { Page, Locator } from '@playwright/test';

export class Dashboard {
    private readonly page: Page;
    private readonly ProductBody: Locator;
    private readonly viewButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ProductBody = page.locator("div.card-body"); 
        this.viewButton = page.getByRole('button', { name: 'View' }).first();
    }

    // Adds a specific product to the cart by its name
    async AddProductToCart(productName: string): Promise<void> {
        await this.viewButton.waitFor({ state: 'visible' }); // Wait for the button to be visible   
        const NoOfProduct = await this.ProductBody.count();
        for (let i = 0; i < NoOfProduct; i++) {
            const ExtractedProductName = await this.ProductBody.nth(i).locator("h5 b").textContent();
            if (ExtractedProductName === productName) {
                await this.ProductBody.nth(i).locator("text=Add To Cart").click();
                break;
            }
        }
    }
}