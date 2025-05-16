import { test, expect } from '@playwright/test';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { loadEnvironmentConfig } from '../Utils/EnvLoader';
import { OrderPage } from '../PageObject/OrderPage';
import { OrderConfirmationPage } from '../PageObject/OrderConfirmationPage';
import { LoginPage } from '../PageObject/LoginPage';
import { Dashboard } from '../PageObject/Dashboard';
import { HomePage } from '../PageObject/HomePage';
import { CartPage } from '../PageObject/CartPage';
import { ExcelReader } from '../Utils/ExcelReader';
import { ScreenshotUtil } from '../Utils/ScreenshotUtil';
import logger, { getTestLogger, mergeLogs, cleanLoggingFolder, cleanLoggingFolderAfterMerging } from '../Utils/Logger';
import type { Config, PageObjects, TestData } from '../types';

const env: string = process.env.TEST_ENV || 'QA';
const config: Config = loadEnvironmentConfig(env);


let startTime: number;
let suiteStartTime: number;
let pageObjects: PageObjects;
let testLogger = logger;

const testLogPath = path.join(__dirname, '../Loging/app.log');

test.beforeAll(async () => {
  await cleanLoggingFolder();


  testLogger.info(`🚀 Starting test suite in ${env} environment`);
  testLogger.info(`🌐 Base URL: ${config.baseUrl}`);
  suiteStartTime = Date.now();
});

test.beforeEach(async ({ page }, testInfo) => {
  testLogger = getTestLogger(testInfo.title.replace(/\s+/g, '_'));
  testLogger.info(`Starting test: ${testInfo.title}`);
  startTime = Date.now();

  pageObjects = {
    loginPage: new LoginPage(page),
    dashboard: new Dashboard(page),
    homePage: new HomePage(page),
    cartPage: new CartPage(page),
    orderPage: new OrderPage(page),
    orderConfirmationPage: new OrderConfirmationPage(page)
  };

  try {
    await page.goto(config.baseUrl);
    testLogger.info('Page loaded successfully');
  } catch (error) {
    testLogger.error('Initial navigation failed, retrying...', error);
    await page.waitForTimeout(2000);
    await page.goto(config.baseUrl);
  }
});

test.afterEach(async ({ page }, testInfo) => {
  testLogger.info(`Test "${testInfo.title}" ${testInfo.status} in ${testInfo.duration}ms`);

  if (testInfo.status !== 'passed') {

     testLogger.error(`Test "${testInfo.title}" failed.`);
    testLogger.info('Taking failure screenshot...');
    await ScreenshotUtil.captureFailureScreenshot(page, testInfo.title);
    
    testLogger.info('Taking failure screenshot...');
    await ScreenshotUtil.captureFailureScreenshot(page, testInfo.title);

   
  }

  try {
    testLogger.info(`Closing logger for test: ${testInfo.title}`);
    if (typeof testLogger.close === 'function') {
      testLogger.close();
      console.info(`✅ Logger closed for test: ${testInfo.title}`);
    }
  } catch (error) {
    console.error(`❌ Error closing logger for test "${testInfo.title}":`, error);
  }
});

test.afterAll(async () => {
  const suiteEndTime = Date.now();
  const totalDuration = suiteEndTime - suiteStartTime;
  testLogger.info('All test cases executed.');
  testLogger.info(`Total execution time: ${totalDuration}ms`);

  await mergeLogs();
  testLogger.info('Logging folder cleaned after merging logs.');
  await cleanLoggingFolderAfterMerging();
});

test('Navigate to Application URL', async ({ page }) => {
  try {
    const expectedLoginUrl = `${config.baseUrl}auth/login`;
    await expect(page).toHaveURL(expectedLoginUrl);
    await expect(page.locator('input#userEmail')).toBeVisible();
    await expect(page.locator('input#userPassword')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

    testLogger.info(`Successfully navigated to login page: ${expectedLoginUrl}`);
  } catch (error) {
    testLogger.error('Navigation test failed:', error);
    throw error;
  }
});

test('End to End Scenario', async ({ page }) => {
  try {
    const testData: TestData = await ExcelReader.getRowDataAsJson(
      '../TestData/TestData.xlsx',
      'Sheet1',
      'Index',
      'Index-1'
    );

    await pageObjects.loginPage.login(testData.UserName, testData.Password);
    await pageObjects.dashboard.AddProductToCart(testData.Product);
    await pageObjects.homePage.ClickOnCartButton();
    await pageObjects.cartPage.verifyItemInCart(testData.Product);
    await pageObjects.cartPage.clickCheckoutButton();
    await pageObjects.orderPage.FillPaymentDetails();

    const orderProduct = await pageObjects.orderConfirmationPage.getAllTitleTexts();
    await expect(orderProduct).toContain(testData.Product );
  } catch (error) {
    if (error instanceof Error) {
      testLogger.error('Test execution failed:', error.message);

    }
    throw error;
  }
});
