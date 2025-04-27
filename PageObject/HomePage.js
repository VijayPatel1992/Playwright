class HomePage{

    constructor(page){
        this.page = page;
        this.viewButton = page.getByRole('button', { name: 'View' }).nth(2);
        this.cartButton = page.locator("button[routerlink='/dashboard/cart']");
    }

    // Clicks on the cart button to navigate to the cart page
    async ClickOnCartButton(){
        await this.cartButton.click();
    }

}
module.exports = { HomePage };