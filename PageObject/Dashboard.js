class Dashboard {
    constructor(page) {
        this.page = page;
        this.ProductBody = page.locator("div.card-body"); 
        this.viewButton = page.getByRole('button', { name: 'View' }).first(); // Ensure correct nth index
    }

    // Adds a specific product to the cart by its name
    async AddProductToCart(productName) {
        await this.viewButton.waitFor({ state: 'visible' }); // Wait for the button to be visible   
        var NoOfProduct = await this.ProductBody.count(); // Use 'this.ProductBody' consistently
        for (var i = 0; i < NoOfProduct; i++) {
            const ExtractedProductName = await this.ProductBody.nth(i).locator("h5 b").textContent(); // Ensure correct selector
            if (ExtractedProductName === productName) {
                await this.ProductBody.nth(i).locator("text=Add To Cart").click(); // Correct selector format
                break;
            }
        }
    }
}

module.exports = { Dashboard };