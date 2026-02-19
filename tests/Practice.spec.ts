import {test, expect, chromium} from "playwright/test";
import fs from 'fs';
import path from 'path';

test('Practices test', async()=> {
    const browser = await chromium.launch({headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://demoqa.com');

    await page.getByRole('link', { name: 'Elements' }).click();

    const response = await page.waitForResponse(
        response => response.url().includes('/elements') && response.status() === 200
    )
    await page.locator('#message').waitFor({ state: 'visible' });

    page.on('dialog', async dialog => {
        console.log(`Alert message: ${dialog.message()}`)
        await dialog.accept('VIjay')
    })
    const NewPage = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('button', { name: 'Click Me' }).click()
    ])
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        await page.getByRole('button', { name: 'Download' }).click()
    ])

    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('#uploadFile').click()
    ])

})




test('practices test 2',async({page}) =>{
    await page.goto('https://demoqa.com')
    page.keyboard.press('Control+Shift+I')

     page.on('dialog', async dialog => {
        console.log(`Alert message: ${dialog.message()}`)
        await dialog.accept('VIjay')
    })
    fs.readFileSync(path.join(__dirname, '../downloads', 'sample.txt'), 'utf-8')


    
})

test('Download file', async({page}) => {
    await page.goto('https://demoqa.com');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();

    const downloadedFile = await download;
    const filepath = await downloadedFile.saveAs(`./downloads/${downloadedFile.suggestedFilename()}`);
  

})




