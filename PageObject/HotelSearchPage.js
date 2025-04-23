class HotelSearchPage {
    constructor(page) {
        this.page = page;
        this.hotelsLink = page.getByRole('link', { name: 'Hotels' });
        this.cityTextboxElement = page.locator("div.selectHtlCity");
        this.cityTextbox = page.locator("input[placeholder='Where do you want to stay?']");
        this.dateRowGroup = page.getByRole('rowgroup').filter({ hasText: /27.*31/ });
        this.roomSelect = page.locator('div.gstSlct span[data-testid="room_count"]');
        this.adultSelect = page.locator('div.gstSlct span[data-testid="adult_count"]');
        this.childSelect = page.locator('div.gstSlct span[data-testid="children_count"]');
        this.applyButton = page.getByRole('button', { name: 'APPLY' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }

    async navigateToHotels() {
        await this.hotelsLink.click();
    }

    async enterLocation(location, suggestionText) {
        await this.cityTextboxElement.click();
        await this.cityTextbox.fill(location);
        await this.page.getByText(suggestionText).click();
    }

    async selectDates(checkInLabel, checkOutLabel) {
        await this.dateRowGroup.getByLabel(checkInLabel).click();
        await this.dateRowGroup.getByLabel(checkOutLabel).click();
    }

    async setGuests(room, adults, children) {

        var Index;
        var IndexElement;
        await this.roomSelect.click();
        IndexElement = await "ul.gstSlct__list li:nth-child("+parseInt(room)+")";
        await this.page.locator(IndexElement).click();

        await this.adultSelect.click();
         IndexElement = await "ul.gstSlct__list li:nth-child("+parseInt(adults)+")";       
        await this.page.locator(IndexElement).click();

        await this.childSelect.click();
        var childIndex = parseInt(children) +1;
         IndexElement =await "ul.gstSlct__list li:nth-child("+childIndex+")";        
        await this.page.locator(IndexElement).click();


        await this.applyButton.click();
    }

    async search() {
        await this.searchButton.click();
    }
}

module.exports = { HotelSearchPage };