import { Page, Locator } from '@playwright/test';
import { Dashboard } from './Dashboard';

export class LoginPage {
    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator("input#userEmail");
        this.passwordInput = page.locator("input#userPassword");
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }    // Navigates to the login page
    async goto(): Promise<void> {
        try {
            await this.page.goto('https://rahulshettyacademy.com/client/');
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Navigation to login page failed:', error.message);
                await this.page.screenshot({
                    path: `./test-results/navigation-failed-${Date.now()}.png`
                });
                throw new Error(`Navigation to login page failed: ${error.message}`);
            }
            throw error;
        }
    }// Logs in using the provided email and password
    async login(email: string, password: string): Promise<Dashboard> {
        try {
            await this.emailInput.click();
            await this.emailInput.fill(email);
            await this.passwordInput.click();
            await this.passwordInput.fill(password);
            await this.loginButton.click();
            await this.page.waitForLoadState('networkidle'); // Wait for network to be idle after login
        } catch (error) {
            if (error instanceof Error) {
                console.error('Login failed:', error.message);
                await this.page.screenshot({
                    path: `./test-results/login-failed-${Date.now()}.png`
                });
                throw new Error(`Login process failed: ${error.message}`);
            }
            throw error;
        }

        const dashboardPage  = new Dashboard(this.page);
        return dashboardPage; // Return the Dashboard page object for further actions
    }
}