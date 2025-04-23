import{test} from '@playwright/test';

test('Hotel Search', async({page})=>{

    await page.goto("https://www.makemytrip.com/");
    await page.locator("span.commonModal__close").click();
    await page.locator("//div[@class='chHeaderContainer']//li//a//span[text() = 'Hotels' and @class='headerIconTextAlignment chNavText darkGreyText']").click();


}


)