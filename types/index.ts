export interface TestData {
    UserName: string;
    Password: string;
    Product: string;
    [key: string]: string;
}

export interface Config {
    baseUrl: string;
    [key: string]: any;
}

export interface PageObjects {
    loginPage: any;
    dashboard: any;
    homePage: any;
    cartPage: any;
    orderPage: any;
    orderConfirmationPage: any;
}
