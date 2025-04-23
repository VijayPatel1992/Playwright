import { test, expect } from '@playwright/test'
import { OrderPage } from '../PageObject/OrderPage'
import { OrderConfirmationPage } from '../PageObject/OrderConfirmationPage'
import { cwd } from 'process'
const { LoginPage } = require('../PageObject/LoginPage')
const { Dashboard } = require('../PageObject/Dashboard')
const { HomePage } = require('../PageObject/HomePage')
const { CartPage } = require('../PageObject/CartPage')  
const ExcelReader = require('../Utils/ExcelReader') ;

test('End to End Scenario', async ({ page }) => {

    const Obj_LoginPage = new LoginPage(page);
    const Obj_Dashboard = new Dashboard(page);
    const Obj_HomePage = new HomePage(page);
    const Obj_CartPage = new CartPage(page);
    const Obj_OrderPage = new OrderPage(page);
    const Obj_OrderConfirmationPage = new OrderConfirmationPage(page);  
   
    
    await Obj_LoginPage.goto();
    const TestDataset =await ExcelReader.getRowDataAsJson( '../TestData/TestData.xlsx','Sheet1', 'Index', 'Index-1'); // Read data from Excel file
    await Obj_LoginPage.login(TestDataset.UserName, TestDataset.Password); // Login with credentials from Excel
    
    await Obj_Dashboard.AddProductToCart(TestDataset.Product);
    await Obj_HomePage.ClickOnCartButton();
    await Obj_CartPage.verifyItemInCart(TestDataset.Product); // Verify item in cart
    await Obj_CartPage.clickCheckoutButton(); // Click checkout button
    await Obj_OrderPage.FillPaymentDetails();
    var OrderProduct = await Obj_OrderConfirmationPage.getAllTitleTexts();
    await expect(OrderProduct).toContain(TestDataset.Product);   

}

)