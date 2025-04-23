import{test, expect} from '@playwright/test';
const { HotelSearchPage } = require('../PageObject/HotelSearchPage');

test('Hotel Search', async({page})=>{
    
    await page.goto("https://www.makemytrip.com/");  
    const hotelPage = new HotelSearchPage(page);    
    await page.locator("span.commonModal__close").click();
    await hotelPage.navigateToHotels();
    await hotelPage.enterLocation("Delhi", "New Delhi Railway Station");
    await hotelPage.selectDates("Thu May 01", "Fri May 02");
    await hotelPage.setGuests(
      "01",
      "02",
      "0"
    );
    await hotelPage.search();
}


);