import{test} from '@playwright/test';
import '../../hooks/hooks';
// Page Object Imports
import { OutletMenuNav } from '../../pages/outletMenuNavigation';
import { AllOutletNames } from '../../pages/Tracsens/getOutletNames';
import { OutletPage } from '../../pages/Tracsens/searchOutletNames';
import { AuditPage } from '../../pages/Tracsens/auditPage';
import { DashboardPage } from '../../pages/Tracsens/dashboardPage';
import { OutletInformationPage } from '../../pages/Tracsens/outletInformation';
// Test Data
import outletData from '../testdata/outletData.json';



// This test suite validates the complete Outlet Management flow:
//  * 1. Sidebar navigation (Menu & Submenu validation)
//  * 2. Fetching all outlet names
//  * 3. Searching specific outlet
//  * 4. Viewing outlet information
//  * 5. Audit page validation + category filtering + PDF export
//  * 6. Dashboard data validation
//  * Each step uses Page Object Model (POM) for better maintainability.
//  * Test data is driven from outletData.json for scalability.
//  * Author  : Lakshmi
//  * Date    : 2026-05-29
//  * @testFile outletData.json — contains menu, subMenu, searchOutletName,
//  *                             filter, targetAuditId, selectCategory
//  * @dependencies
// - hooks/hooks            → handles login and logout before/after each test
//  *  - OutletMenuNav          → handles sidebar menu and submenu navigation
//  *  - OutletPage             → handles outlet management page operations
//  *  - OutletInformationPage  → handles outlet information tab operations
//  *  - AuditPage              → handles audit details and PDF export operations
//  *  - DashboardPage          → handles performance dashboard operations
//  */

// Page Object Model instances declared at module level so they are accessible across all test blocks
let outletMenuPage:OutletMenuNav;
let allOutletNames:AllOutletNames;
let outletPage:OutletPage;
let auditPage:AuditPage;
let dashboardPage:DashboardPage;
let outletinformationPage:OutletInformationPage;
/**
 * Test Data Mapping from JSON
 */
const menuData = outletData.menuAndSubMenuTestCases;
const searchOutletName=outletData.searchoutletNameTestCase;
const outletInformation=outletData.outletInformationTestCase;
const getDashboardValues=outletData.getDashboardValuesTestCase;
const getAuditDetails=outletData.auditPageTestCase;

//step:1
test('outletMenuAndSubMenu', async ({ page }) => {

    const outletMenuPage = new OutletMenuNav(page);

    for (const data of menuData) {

        try{

            console.log(`Running: ${data.testCase}`);

            await outletMenuPage.outletMenuAndSubMenu(data.menu,data.subMenu);
            console.log(`✅ Passed: ${data.testCase}`);

        } catch (error) {

            console.log(`❌ Failed: ${data.testCase}`);

            if (error instanceof Error) {
            console.log(error.message);
            }
    }
    }
    });
    
//step:2
test('getAllOutletNames', async ({ page }) => {

    const allOutletNames = new AllOutletNames(page);

    for (const data of menuData) {

        try{

            console.log(`Running: ${data.testCase}`);

            await allOutletNames.getAllOutletNames(data.menu,data.subMenu);
            console.log(`✅ Passed: ${data.testCase}`);

        } catch (error) {

            console.log(`❌ Failed: ${data.testCase}`);

            if (error instanceof Error) {
            console.log(error.message);
            }
    }
    }
    });
//step:3
test('Search Particular Outlet Names',async({page})=>{
    // Initialize outlet Page object
    const outletPage=new OutletPage(page);
    // Loop through each record in outletData 
    for (const data of searchOutletName) {
    try{
          console.log(`Running: ${data.testCase}`);
          await outletPage.searchOutletName(data.menu,data.subMenu,data.searchOutletName,data.filter);
          console.log(`✅ Passed: ${data.testCase}`);


    }
    
    catch (error) {
        console.log(`❌ Failed: ${data.testCase}`);
    if (error instanceof Error) {
        console.log(error.message);
    }
}
    }

});
//step:4
test('outletInformation',async({page})=>{
    // Initialize outletInformation Page object
     outletinformationPage=new OutletInformationPage(page);
    try{
    
    // Loop through each record in outletData 
    for (const data of outletInformation) {

        
        await outletinformationPage.outletInformation(data.menu,data.subMenu,data.searchOutletName,data.filter);
        

    }
    }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}

});

//step:5
test.only('auditsPage', async ({ page }) => {

    const auditPage = new AuditPage(page);

    for (const data of getAuditDetails) {

        try {
              console.log(`Running: ${data.testCase}`);

            await auditPage.auditsPage(data.menu,data.subMenu,data.searchOutletName,data.filter,data.targetAuditId,data.selectCategory);

            console.log(`✅ Passed: ${data.testCase}`);

        } catch (error) {
            console.log(`❌ Failed: ${data.testCase}`);

            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

});
//step:6
test('getDashboardValues',async({page})=>{
    // Initialize outlet and audit Page object
     const dashboardPage=new DashboardPage(page);
    try{
    
    // Loop through each record in outletData 
    for (const data of getDashboardValues) {

        
        await dashboardPage.getDashboardValues(data.menu,data.subMenu,data.searchOutletName,data.filter,data.targetAuditId);
    }
    }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}

});

