class LoginPage {

    constructor(page) {
        this.page = page;
        this.emailInput = page.locator("input#userEmail");
        this.passwordInput = page.locator("input#userPassword");
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goto() {
        await this.page.goto('https://rahulshettyacademy.com/client/');
    }

    async login(email, password) {
        await this.emailInput.click();
        await this.emailInput.fill(email);
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle'); // Wait for network to be idle after login
        
    }
}


module.exports = { LoginPage };