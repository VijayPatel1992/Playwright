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
const env = process.env.TEST_ENV || 'QA';
const config = loadEnvironmentConfig(env);

// Test fixtures
let testContext = {};

// Custom test fixture with retries and timeouts
const customTest = test.extend({
    testData: async ({}, use) => {
        // Load test data before tests
        try {
            const data = await ExcelReader.getRowDataAsJson('../TestData/TestData.xlsx', 'Sheet1', 'Index', 'Index-1');
            await use(data);
        } catch (error) {
            console.error('Failed to load test data:', error);
            throw new Error(`Test data loading failed: ${error.message}`);
        }
    }
});

customTest.beforeAll(async () => {
    console.log(`Starting test suite in ${env} environment`);
    console.log('Base URL:', config.baseUrl);
});

customTest.beforeEach(async ({ page }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
    testContext.startTime = Date.now();

    try {
        // Initialize page objects
        testContext.loginPage = new LoginPage(page);
        testContext.dashboard = new Dashboard(page);
        testContext.homePage = new HomePage(page);
        testContext.cartPage = new CartPage(page);
        testContext.orderPage = new OrderPage(page);
        testContext.orderConfirmationPage = new OrderConfirmationPage(page);

        // Navigate to base URL with retry logic
        await page.goto(config.baseUrl).catch(async (error) => {
            console.error('Initial navigation failed, retrying...', error);
            await page.waitForTimeout(2000);
            await page.goto(config.baseUrl);
        });

        console.log('Page loaded successfully');
    } catch (error) {
        console.error('Test setup failed:', error);
        // Capture setup failure screenshot
        await page.screenshot({ 
            path: `./test-results/setup-failure-${testInfo.title}-${Date.now()}.png`,
            fullPage: true 
        });
        throw error;
    }
});

customTest.afterEach(async ({ page }, testInfo) => {
    const duration = Date.now() - testContext.startTime;
    console.log(`Test "${testInfo.title}" ${testInfo.status} in ${duration}ms`);

    if (testInfo.status !== 'passed') {
        console.log('Taking failure screenshot...');
        await page.screenshot({ 
            path: `./test-results/${testInfo.title}-failure-${Date.now()}.png`,
            fullPage: true 
        });
    }

    await page.close();
});

customTest.afterAll(async () => {
    console.log('Test suite completed');
});

// Main test case with improved error handling
customTest('End to End Scenario', async ({ page, testData }) => {
    try {
        // Login
        await testContext.loginPage.login(testData.UserName, testData.Password);
        console.log('Login successful');

        // Add product to cart
        await testContext.dashboard.AddProductToCart(testData.Product);
        console.log('Product added to cart');

        // Navigate to cart
        await testContext.homePage.ClickOnCartButton();
        console.log('Navigated to cart');

        // Verify cart and checkout
        await testContext.cartPage.verifyItemInCart(testData.Product);
        await testContext.cartPage.clickCheckoutButton();
        console.log('Cart verification and checkout completed');

        // Complete payment
        await testContext.orderPage.FillPaymentDetails();
        console.log('Payment details filled');

        // Verify order confirmation
        const OrderProduct = await testContext.orderConfirmationPage.getAllTitleTexts();
        await expect(OrderProduct, 'Order confirmation should contain the correct product').toContain(testData.Product);
        console.log('Order confirmation verified');

    } catch (error) {
        console.error('Test execution failed:', error);
        throw error; // Re-throw to mark the test as failed
    }
});