import { test, expect } from '@playwright/test';
import { loadEnvironmentConfig } from '../Utils/EnvLoader';
import { OrderPage } from '../PageObject/OrderPage';
import { OrderConfirmationPage } from '../PageObject/OrderConfirmationPage';
import { LoginPage } from '../PageObject/LoginPage';
import { Dashboard } from '../PageObject/Dashboard';
import { HomePage } from '../PageObject/HomePage';
import { CartPage } from '../PageObject/CartPage';
import ExcelReader from '../Utils/ExcelReader';

// Load environment configuration
const env = process.env.TEST_ENV || 'QA';
const config = loadEnvironmentConfig(env);

test.describe('E2E Tests', () => {
    let startTime;
    let pageObjects;

    test.beforeAll(async () => {
        console.log(`Starting test suite in ${env} environment`);
        console.log('Base URL:', config.baseUrl);
    });

    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Starting test: ${testInfo.title}`);
        startTime = Date.now();

        // Initialize page objects
        pageObjects = {
            loginPage: new LoginPage(page),
            dashboard: new Dashboard(page),
            homePage: new HomePage(page),
            cartPage: new CartPage(page),
            orderPage: new OrderPage(page),
            orderConfirmationPage: new OrderConfirmationPage(page)
        };

        // Navigate to base URL with retry logic
        try {
            await page.goto(config.baseUrl);
            console.log('Page loaded successfully');
        } catch (error) {
            console.error('Initial navigation failed, retrying...', error);
            await page.waitForTimeout(2000);
            await page.goto(config.baseUrl);
        }
    });

    test.afterEach(async ({ page }, testInfo) => {
        const duration = Date.now() - startTime;
        console.log(`Test "${testInfo.title}" ${testInfo.status} in ${duration}ms`);

        if (testInfo.status !== 'passed') {
            console.log('Taking failure screenshot...');
            await page.screenshot({ 
                path: `./test-results/${testInfo.title}-failure-${Date.now()}.png`,
                fullPage: true 
            });
        }
    });

    test('Navigate to Application URL', async ({ page }) => {
        try {
            const expectedLoginUrl = `${config.baseUrl}auth/login`;
            await expect(page).toHaveURL(expectedLoginUrl);
            
            // Verify login form elements are present
            await expect(page.locator('input#userEmail')).toBeVisible();
            await expect(page.locator('input#userPassword')).toBeVisible();
            await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
            
            console.log('Successfully navigated to login page:', expectedLoginUrl);
        } catch (error) {
            console.error('Navigation test failed:', error);
            throw error;
        }
    });

    test('End to End Scenario', async ({ page }) => {
        try {
            // Load test data
            const testData = await ExcelReader.getRowDataAsJson('../TestData/TestData.xlsx', 'Sheet1', 'Index', 'Index-1');
            
            // Login
            await pageObjects.loginPage.login(testData.UserName, testData.Password);

            // Add product to cart
            await pageObjects.dashboard.AddProductToCart(testData.Product);
            
            // Navigate to cart
            await pageObjects.homePage.ClickOnCartButton();

            // Verify cart and checkout
            await pageObjects.cartPage.verifyItemInCart(testData.Product);
            await pageObjects.cartPage.clickCheckoutButton();

            // Complete payment
            await pageObjects.orderPage.FillPaymentDetails();
            const OrderProduct = await pageObjects.orderConfirmationPage.getAllTitleTexts();
            await expect(OrderProduct).toContain(testData.Product);

        } catch (error) {
            console.error('Test execution failed:', error);
            throw error;
        }
    });
});