# Test info

- Name: End to End Scenario
- Location: D:\Project\Playwright Automation\tests\HomePageTest.spec.js:16:5

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\patel\AppData\Local\ms-playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { loadEnvironmentConfig } from '../Utils/EnvLoader';
   3 | import { OrderPage } from '../PageObject/OrderPage';
   4 | import { OrderConfirmationPage } from '../PageObject/OrderConfirmationPage';
   5 | const { LoginPage } = require('../PageObject/LoginPage');
   6 | const { Dashboard } = require('../PageObject/Dashboard');
   7 | const { HomePage } = require('../PageObject/HomePage');
   8 | const { CartPage } = require('../PageObject/CartPage');
   9 | const ExcelReader = require('../Utils/ExcelReader');
  10 |
  11 | // Load environment configuration
  12 | const env = process.env.TEST_ENV || 'QA'; // Default to QA if TEST_ENV is not set
  13 | const config = loadEnvironmentConfig(env);
  14 |
  15 |
> 16 | test('End to End Scenario', async ({ page }) => {
     |     ^ Error: browserType.launch: Executable doesn't exist at C:\Users\patel\AppData\Local\ms-playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
  17 |   const Obj_LoginPage = new LoginPage(page);
  18 |   const Obj_Dashboard = new Dashboard(page);
  19 |   const Obj_HomePage = new HomePage(page);
  20 |   const Obj_CartPage = new CartPage(page);
  21 |   const Obj_OrderPage = new OrderPage(page);
  22 |   const Obj_OrderConfirmationPage = new OrderConfirmationPage(page);
  23 |
  24 |   // Navigate to the base URL from the environment config
  25 |   await page.goto(config.baseUrl);
  26 |   console.log('Base URL:', config.baseUrl);
  27 |   console.log('Username:', config.username);   
  28 |
  29 |
  30 |   // Read test data from Excel
  31 |   const TestDataset = await ExcelReader.getRowDataAsJson('../TestData/TestData.xlsx', 'Sheet1', 'Index', 'Index-1');
  32 |
  33 |   await Obj_LoginPage.login(TestDataset.UserName, TestDataset.Password);
  34 |
  35 |
  36 |   // Perform the rest of the test steps
  37 |   await Obj_Dashboard.AddProductToCart(TestDataset.Product);
  38 |   await Obj_HomePage.ClickOnCartButton();
  39 |   await Obj_CartPage.verifyItemInCart(TestDataset.Product);
  40 |   await Obj_CartPage.clickCheckoutButton();
  41 |   await Obj_OrderPage.FillPaymentDetails();
  42 |   const OrderProduct = await Obj_OrderConfirmationPage.getAllTitleTexts();
  43 |   await expect(OrderProduct).toContain(TestDataset.Product);
  44 | });
```