import { test, expect } from '@playwright/test';
import { loadEnvironmentConfig } from '../Utils/EnvLoader';
import { OrderPage } from '../PageObject/OrderPage';
import { OrderConfirmationPage } from '../PageObject/OrderConfirmationPage';
const { LoginPage } = require('../PageObject/LoginPage');
const { Dashboard } = require('../PageObject/Dashboard');
const { HomePage } = require('../PageObject/HomePage');
const { CartPage } = require('../PageObject/CartPage');
const ExcelReader = require('../Utils/ExcelReader');

// Load environment configuration
const env = process.env.TEST_ENV || 'QA'; // Default to QA if TEST_ENV is not set
const config = loadEnvironmentConfig(env);
console.log(`Running tests in environment: ${env}`);
let Obj_LoginPage, Obj_Dashboard, Obj_HomePage, Obj_CartPage, Obj_OrderPage, Obj_OrderConfirmationPage;

test.beforeEach(async ({ page }) => {
  // Initialize page objects before each test
  Obj_LoginPage = new LoginPage(page);
  Obj_Dashboard = new Dashboard(page);
  Obj_HomePage = new HomePage(page);
  Obj_CartPage = new CartPage(page);
  Obj_OrderPage = new OrderPage(page);
  Obj_OrderConfirmationPage = new OrderConfirmationPage(page);

  // Navigate to the base URL
  await page.goto(config.baseUrl);
  console.log('Navigated to:', config.baseUrl);
});

test.afterEach(async ({ page }) => {
  // Perform cleanup after each test
  console.log('Test completed. Performing cleanup...');
  await page.close();
});

test('End to End Scenario', async ({ page }) => {
  // const Obj_LoginPage = new LoginPage(page);
  // const Obj_Dashboard = new Dashboard(page);
  // const Obj_HomePage = new HomePage(page);
  // const Obj_CartPage = new CartPage(page);
  // const Obj_OrderPage = new OrderPage(page);
  // const Obj_OrderConfirmationPage = new OrderConfirmationPage(page);

  // Navigate to the base URL from the environment config
  // await page.goto(config.baseUrl); 


  // Read test data from Excel
  const TestDataset = await ExcelReader.getRowDataAsJson('../TestData/TestData.xlsx', 'Sheet1', 'Index', 'Index-1');

  await Obj_LoginPage.login(TestDataset.UserName, TestDataset.Password);


  // Perform the rest of the test steps
  await Obj_Dashboard.AddProductToCart(TestDataset.Product);
  await Obj_HomePage.ClickOnCartButton();
  await Obj_CartPage.verifyItemInCart(TestDataset.Product);
  await Obj_CartPage.clickCheckoutButton();
  await Obj_OrderPage.FillPaymentDetails();
  const OrderProduct = await Obj_OrderConfirmationPage.getAllTitleTexts();
  await expect(OrderProduct).toContain(TestDataset.Product);
});