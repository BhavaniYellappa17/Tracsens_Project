import{test} from '@playwright/test';
import '../../hooks/hooks';
import { Home_Page } from '../../pages/Tracsens/homePage';
import { AdminPage } from '../../pages/Tracsens/adminPage';
import { adminCustomerPage } from '../../pages/Tracsens/adminCustomerPage';
import { productList } from '../../pages/Tracsens/FetchProductNames';
import { productCategory } from '../../pages/Tracsens/productCategory';
import { productManagement } from '../../pages/Tracsens/productManagement';
import adminData from '../testdata/adminData.json';
import { adminUserPage } from '../../pages/Tracsens/adminUserPage';
import productData from '../testdata/productData.json';



// Page Object Model instances declared at module level
// so they are accessible across all test blocks
let homepage:Home_Page;
let adminPage:AdminPage;
let adminCustomer:adminCustomerPage;
let adminUser:adminUserPage;
let productPage : productManagement;
let FetchproductCategory : productCategory;
let FetchProductNames:productList;

// Fetch and display dashboard statistics from the home page
// test('get dashboard statistics from home page', async ({page}) => {
//     try{
//         // Initialize Home Page object
//      homepage=new Home_Page(page);
//      // Fetch and print all dashboard statistics values
//     //await homepage.get_DashboardValues();

// }
// catch (error) {
//     if (error instanceof Error) {
//         console.log(error.message);
//     }
// }
// });


// // Create multiple customers using test data from adminData.json
// test('create customer',async({page})=>{
//      test.setTimeout(18000);
//     try{
//          // Initialize Admin Page object
//     //adminPage=new AdminPage(page);
//     adminCustomer = new adminCustomerPage(page);
//     adminUser = new adminUserPage(page);
    

//     // Loop through each record in adminData and create a customer
//     for (const data of adminData) {
//          console.log("Executing for:", data.customerName);
//          //await adminPage.adminMenuSubmenu(data.menu!,data.customerSubMenu!);
//         //await adminCustomer.adminCreateVerifyCustomer(data.customerName!,data.customerEmail!,data.customerPhone!,data.customerVerifyName!,data.editcustomerName!,data.menu!,data.customerSubMenu!);
//         //await adminUser.adminCreateVerifyUser(data.userSearch!,data.userFullName!,data.userName!,data.customerEmail!,data.userPassword!,data.userVerifyName!,data.editUserName!,data.menu!,data.UserSubMenu!);
//          }} 
//     catch (error) {
//     if (error instanceof Error) {
//         console.log(error.message);
//     }
// }
// });

//ProductManagement
// test('createProduct',async({page})=>{
//      test.setTimeout(180000);
//     try{   
//         adminUser = new adminUserPage(page);
//         productPage = new productManagement(page)
//     // Loop through each record in adminData and create a customer
//     for (const data of productData) {
//          console.log("Executing for:", data.ProductSubMenu);
//         await productPage.createEditDeleteProduct(data.sproductName,data.sdetailedDescription,data.sstockKeepingUnit,data.sstandardPrice,data.editProdName,data.menu,data.ProductSubMenu);
//          }} 
//     catch (error) {
//     if (error instanceof Error) {
//         console.log(error.message);
//     }
// }
// });
test('Fetch ProductList',async({page})=>{
     test.setTimeout(600000);
    try{   
        
        FetchProductNames = new productList(page)
    // Loop through each record in adminData and create a customer
    
        await FetchProductNames.getAllProductNamesAndSKUs();
         }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}
});


test('Fetch CategoryName',async({page})=>{
     test.setTimeout(180000);
    try{   
        
        FetchproductCategory = new productCategory(page)
    // Loop through each record in adminData and create a customer
    
        await FetchproductCategory.getAllCategoryNames();
         }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}
});









     











