class HomePage{

    constructor(page){
        this.page = page;
        this.viewButton = page.getByRole('button', { name: 'View' }).nth(2);
        this.cartButton = page.locator("button[routerlink='/dashboard/cart']");
    }
    async ClickOnCartButton(){
        await this.cartButton.click();
    }

}
module.exports = { HomePage };