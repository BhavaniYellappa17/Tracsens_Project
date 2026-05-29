import{test} from '@playwright/test';
import '../../hooks/hooks';
import { OutletMenuNav } from '../../pages/outletMenuNavigation';
import { OutletPage } from '../../pages/Tracsens/outletManagement';
import { AuditPage } from '../../pages/Tracsens/auditPage';
import { DashboardPage } from '../../pages/Tracsens/dashboardPage';
import { OutletInformationPage } from '../../pages/Tracsens/outletInformation';
import outletData from '../testdata/outletData.json';

// * This file contains end-to-end test cases for the Outlet Management module
//  * including sidebar navigation, outlet search and filter, outlet information,
//  * audit details, and performance dashboard operations.
//  *
//  * @module OutletManagementTests
//  * @author Lakshmi
//  * @date 2026-05-29
//  *
//  * @testFile outletData.json — contains menu, subMenu, searchOutletName,
//  *                             filter, targetAuditId, selectCategory
//  * @dependencies
//    * - hooks/hooks            → handles login and logout before/after each test
//  *  - OutletMenuNav          → handles sidebar menu and submenu navigation
//  *  - OutletPage             → handles outlet management page operations
//  *  - OutletInformationPage  → handles outlet information tab operations
//  *  - AuditPage              → handles audit details and PDF export operations
//  *  - DashboardPage          → handles performance dashboard operations
//  *  
//  */

// Page Object Model instances declared at module level
// so they are accessible across all test blocks
let outletMenuPage:OutletMenuNav;
let outletPage:OutletPage;
let auditPage:AuditPage;
let dashboardPage:DashboardPage;
let outletinformationPage:OutletInformationPage;

/**
 * @test Step 1 — outletMenuAndSubMenu
 * @description Navigates to Outlet Management page by:
 * 1. Clicking the Outlet Management main menu from sidebar
 * 2. Clicking the Outlets submenu
 * 3. Validating navigation to Outlet Management page
 *
 * @param page - Playwright Page object injected by the test runner
 *
 * @example
 * // Run this test using:
 * npx playwright test outletManagement.spec.ts
 */
test('outletMenuAndSubMenu',async({page})=>{
    try{
    // Initialize outlet Page object
    outletMenuPage=new OutletMenuNav(page);
    
    // Loop through each record in outletData 
    //for (const data of outletData) {

        await outletMenuPage.outletMenuAndSubMenu(outletData.menu,outletData.subMenu);
        

    //}
    }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}

});

/**
 * @test Step 2 — OutletManagement
 * @description Performs outlet management page operations by:
 * 1. Navigating to Outlet Management page via sidebar
 * 2. Searching for the given outlet name
 * 3. Applying the given date filter
 * 4. Collecting all outlet names, external IDs and created dates
 * 5. Clicking the matching outlet to navigate to outlet details page
 *
 * @param page - Playwright Page object injected by the test runner
 */
test('OutletManagement',async({page})=>{
    try{
    // Initialize outlet Page object
    outletPage=new OutletPage(page);
    
    // Loop through each record in outletData 
    //for (const data of outletData) {

        await outletPage.outletManagementPage(outletData.menu,outletData.subMenu,outletData.searchOutletName,outletData.filter);
        

    //}
    }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}

});

/**
 * @test Step 3 — outletInformation (currently running with test.only)
 * @description Fetches all outlet information details by:
 * 1. Navigating to Outlet Management page via sidebar
 * 2. Searching and filtering for the given outlet
 * 3. Clicking outlet name to navigate to outlet details page
 * 4. Clicking Outlet Information tab
 * 5. Fetching and logging all outlet information fields
 *    (Name, External ID, System ID, Address, City, Region,
 *     State, Postal Code, Coordinates, Created Date)
 */
test('outletInformation',async({page})=>{
    try{
    // Initialize outletInformation Page object
     outletinformationPage=new OutletInformationPage(page);
    // Loop through each record in outletData 
    //for (const data of outletData) {

        
        await outletinformationPage.outletInformation(outletData.menu,outletData.subMenu,outletData.searchOutletName,outletData.filter);
        

    //}
    }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}

});

/**
 * @test Step 4 — auditsPage
 * @description Performs complete audit page operations by:
 * 1. Navigating to Outlet Management page via sidebar
 * 2. Searching and filtering for the given outlet
 * 3. Clicking outlet name to navigate to outlet details page
 * 4. Clicking Audits tab to navigate to audit section
 * 5. Searching for the given Audit ID across all pages
 * 6. Clicking View button for the matching audit
 * 7. Resetting filters and selecting given category
 * 8. Fetching brands and SKUs for each rack
 * 9. Exporting and verifying audit PDF report
 */
test('auditsPage',async({page})=>{
    try{
    // Initialize audit Page object
     auditPage=new AuditPage(page);
    // Loop through each record in outletData 
    //for (const data of outletData) {

        
        await auditPage.auditsPage(outletData.menu,outletData.subMenu,outletData.searchOutletName,outletData.filter,outletData.targetAuditId,outletData.selectCategory);
        
    //}
    }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}

});
/**
 * @test Step 5 — getDashboardValues
 * @description Fetches performance dashboard values by:
 * 1. Navigating to Outlet Management page via sidebar
 * 2. Searching and filtering for the given outlet
 * 3. Clicking outlet name to navigate to outlet details page
 * 4. Clicking Audits tab to navigate to audit section
 * 5. Searching for the given Audit ID across all pages
 * 6. Clicking View Performance Dashboard button for matching audit
 * 7. Fetching Unique SKUs, Detected SKUs, Diageo values, Retention Rate
 * 8. Fetching and logging Missing SKUs list
 * 9. Exporting and verifying dashboard PDF report
 */
test('getDashboardValues',async({page})=>{
    try{
    // Initialize outlet and audit Page object
     dashboardPage=new DashboardPage(page);
    // Loop through each record in outletData 
    //for (const data of outletData) {

        
        await dashboardPage.getDashboardValues(outletData.menu,outletData.subMenu,outletData.searchOutletName,outletData.filter,outletData.targetAuditId);
    //}
    }
    catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    }
}

});









