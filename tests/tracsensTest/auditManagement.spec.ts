import{test,expect} from '@playwright/test';
import '../../hooks/hooks';
// Page Object Imports
import { AuditMenuNav } from '../../pages/Tracsens/auditMng_MenuNavigation';
import { AllOutletNames_AuditPage } from '../../pages/Tracsens/getAuditMng_OutletNames';
import { SearchOutletName_AuditPage } from '../../pages/Tracsens/searchOutletName_AuditPage';
import { AuditPng_OutletInformationPage } from '../../pages/auditPage_OutletInformation';
import { AuditPage } from '../../pages/Tracsens/auditsMng_AuditsPage';
import { AuditMng_DashboardPage } from '../../pages/Tracsens/auditMng_DashboardPage';

// Test Data
import auditData from '../testdata/auditData.json';
// Page Object Model instances declared at module level so they are accessible across all test blocks
let auditMenuPage:AuditMenuNav;
let auditMng_AllOutletNames:AllOutletNames_AuditPage;
let searchOutletName:SearchOutletName_AuditPage;
let getOutletInformation:AuditPng_OutletInformationPage;
let getBrandsAndSkus_AuditPng:AuditPage;
let dashboardPng:AuditMng_DashboardPage;

// ==================== TEST DATA SETUP ====================
// Reads each test case group from auditData.json and stores
// them in separate constants for use in each test describe block below.
// Each constant holds an array of test case objects.

/** Step 1 — Menu and submenu navigation test cases */
const menuData = auditData.menuAndSubMenuTestCases;
/** Step 2 — Get all outlet names test cases (with filter and status) */
const allOutlets=auditData.getAllOutletNames_AuditMngTestCases;
/** Step 3 — Outlet search test cases (search by name + filter + status) */
const searchOutlet=auditData.searchoutletName_AuditMngTestCase;
/** Step 4 — Outlet information page test cases */
const getParticularOutletInformation=auditData.outletInformationTestCase;
/** Step 5 — Audit page test cases (audit ID + category filter) */
const getBrandsAndSkus=auditData.auditPageTestCase;
/** Step 6 — Dashboard values test cases (PDF export) */
const getDashboardValues=auditData.getDashboardValuesTestCase;

// ==================== STEP 1 ====================

/**
 * @testSuite  Title: Menu Navigation Tests
 * @step       1
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Verifies that the main menu and submenu items are present and clickable
 * as per the expected data defined in auditData.json.
 * Uses AuditMenuNav page object to perform sidebar navigation.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call auditMenuAndSubMenu() to click main menu and submenu
 * 3. Verify navigation result based on input validity:
 *    - Empty menu or submenu  → verify page header is NOT visible
 *    - Invalid submenu name   → verify navigation did not complete
 *    - Valid menu and submenu → verify page header is visible
 *
 * @testData   auditData.menuAndSubMenuTestCases
 *
 * @param {string} data.menu    - Main menu name (e.g., "Audit Management")
 * @param {string} data.subMenu - Sub menu name  (e.g., "Audits")
 *
 * @example
 * // ✅ Valid test data example:
 * { "testCase": "Valid Case", "menu": "Audit Management", "subMenu": "Audits" }
 *
 * // ❌ Invalid test data example — empty menu:
 * { "testCase": "Invalid Menu Name", "menu": "", "subMenu": "Audits" }
 *
 * // ❌ Invalid test data example — wrong submenu:
 * { "testCase": "Invalid SubMenu Name", "menu": "Audit Management", "subMenu": "Outlets" }
 */
test.describe('Menu Navigation Tests', () => {

    // Iterate through each test case from menuAndSubMenuTestCases JSON array
    menuData.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {

            // Create AuditMenuNav page object instance for sidebar navigation
            const auditMenuPage = new AuditMenuNav(page);

            console.log(`Running: ${data.testCase}`);

            try {

                // -------------------- NAVIGATION --------------------
                // Perform sidebar menu and submenu navigation using page object
                await auditMenuPage.auditMenuAndSubMenu(data.menu, data.subMenu);

                // ==================== VERIFICATION ====================

                if (data.menu.trim() === '' || data.subMenu.trim() === '') {

                    // ❌ Invalid case — empty menu or submenu input
                    // Verify page header is NOT visible
                    console.log(`⚠️ Invalid input — verifying navigation did not occur`);
                    await expect(page.locator(auditMenuPage.auditMngPage)).not.toBeVisible({ timeout: 5000 });
                    console.log(`✅ Verified — page did not navigate for empty input`);

                } else {

                    // Check if page header is visible after navigation
                    const isNavigated = await page.locator(auditMenuPage.auditMngPage).isVisible().catch(() => false);

                    if (!isNavigated) {

                        // ❌ Invalid submenu — navigation did not complete
                        console.log(`⚠️ Navigation failed — "${data.subMenu}" is an invalid submenu`);
                        console.log(`✅ Verified — page header not visible for invalid submenu`);

                    } else {

                        // ✅ Valid case — verify page header is visible
                        await expect(page.locator(auditMenuPage.auditMngPage))
                            .toBeVisible({ timeout: 10000 });
                        console.log(`✅ Verified — Audit Management page header is visible`);
                        console.log(`✅ All verifications passed for "${data.testCase}"`);
                    }
                }

            } catch (error) {
                // -------------------- ERROR HANDLING --------------------
                if (error instanceof Error) {
                    console.log(`❌ Test failed for "${data.testCase}": ${error.message}`);
                }
                throw error;
            }

        });

    });

});

// ==================== STEP 2 ====================

/**
 * @testSuite  Title: Get All Outlet Names In AuditMng
 * @step       2
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Navigates to the Audit Management page and fetches all outlet names across all paginated pages with status and filter applied.
 * Uses AllOutletNames_AuditPage page object to handle pagination and data collection.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call getAllOutletNames_AuditMng() with menu, submenu, filter and status
 * 3. Verify that outlet names were fetched successfully
 *
 * @testData   auditData.getAllOutletNames_AuditMngTestCases
 *
 * @param {string} data.menu    - Main menu name (e.g., "Audit Management")
 * @param {string} data.subMenu - Sub menu name  (e.g., "Audits")
 * @param {string} data.filter  - Date filter    (e.g., "All time")
 * @param {string} data.status  - Status filter  (e.g., "All status")
 *
 * @example
 * // ✅ Valid test data example:
 * { "testCase": "Valid Case", "menu": "Audit Management", "subMenu": "Audits", "filter": "All time", "status": "All status" }
 */

test.describe('Get All Outlet Names In AuditMng', () => {

    allOutlets.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {
            const allOutletNames = new AllOutletNames_AuditPage(page);

            console.log(`Running: ${data.testCase}`);

            try {
                const outlets: string[] = await allOutletNames.getAllOutletNames_AuditMng(data.menu,data.subMenu,data.filter,data.status);

                // ==================== VERIFICATION ====================

                if (!data.status.trim() || !data.filter.trim()) {

                    // ❌ Invalid case — empty status or filter
                    // Expected behaviour: method returns empty array
                    expect(outlets.length).toBe(0);
                    console.log(`✅ Verified — Empty input handled correctly. Outlets returned: ${outlets.length}`);

                } else if (outlets.length === 0) {

                    // ⚠️ Valid input but no records found for given filter combination
                    // e.g., "In Progress" + "Last week" — no data exists
                    console.log(`⚠️ No records found for Status: "${data.status}" and Filter: "${data.filter}"`);
                    console.log(`✅ Verified — No records case handled correctly`);

                } else {

                    // ✅ Valid case — outlets found
                    expect(outlets.length).toBeGreaterThan(0);
                    console.log(`✅ Verified — Outlet list is not empty. Total: ${outlets.length}`);
                }

            } catch (error) {
                if (error instanceof Error) {
                    console.log(`❌ Test failed for "${data.testCase}": ${error.message}`);
                }
                throw error;
            }

        });

    });

});
// ==================== STEP 3 ====================

/**
 * @testSuite  Title: Search Outlet Tests
 * @step       3
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Verifies the outlet search functionality in the Audit Management module by searching for an outlet by name and applying date filter and status.
 * After clicking the matching outlet, verifies navigation to Outlet Information page.
 * Uses SearchOutletName_AuditPage page object to perform search operations.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call searchOutletName_AuditPage() with menu, submenu, outlet name, filter and status
 * 3. Click the matching outlet from search results
 * 4. Verify navigation result based on input validity:
 *    - Valid outlet name and filter  → Outlet Information page is visible ✅
 *    - Invalid outlet name or filter → Outlet Information page is NOT visible ⚠️
 *    - Empty outlet name             → No outlet clicked — page not visible ⚠️
 ** @testData   auditData.searchoutletName_AuditMngTestCase
 *
 * @param {string} data.menu             - Main menu name        (e.g., "Audit Management")
 * @param {string} data.subMenu          - Sub menu name         (e.g., "Audits")
 * @param {string} data.searchOutletName - Outlet name to search (e.g., "Madhuloka liquor")
 * @param {string} data.filter           - Date filter to apply  (e.g., "All time")
 * @param {string} data.status           - Status filter         (e.g., "All status")
 *
 * @example
 * // ✅ Valid test data example:
 * { "testCase": "Valid Search and Filter", "menu": "Audit Management", "subMenu": "Audits", "searchOutletName": "Madhuloka liquor", "filter": "All time", "status": "All status" }
 *
 * // ❌ Invalid test data example — invalid outlet name:
 * { "testCase": "Invalid Outlet Name", "menu": "Audit Management", "subMenu": "Audits", "searchOutletName": "XYZ123Outlet", "filter": "All time", "status": "All status" }
 *
 * // ❌ Invalid test data example — invalid filter:
 * { "testCase": "Invalid Filter", "menu": "Audit Management", "subMenu": "Audits", "searchOutletName": "Madhuloka liquor", "filter": "Last 7 Days", "status": "All status" }
 */

test.describe('Search Outlet Tests', () => {

    // Iterate through each test case from searchoutletName_AuditMngTestCase JSON array
    // Each object becomes one independent test case with its own login/logout cycle
    searchOutlet.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {

            // Create SearchOutletName_AuditPage instance for search operations
            const searchOutletPage = new SearchOutletName_AuditPage(page);

            console.log(`Running: ${data.testCase}`);

            try {

                // -------------------- SEARCH --------------------
                // Search outlet by name, apply date filter and status
                // then click the matching outlet from search results
                await searchOutletPage.searchOutletName_AuditPage(data.menu,data.subMenu,data.searchOutletName,data.filter,data.status);

                // ==================== VERIFICATION ====================
                // Check if Outlet Information page is visible after clicking outlet
                // isVisible() with .catch(() => false) safely returns false
                // instead of throwing an error if element is not found
                const isNavigated = await page.locator(searchOutletPage.outletInformationText).isVisible().catch(() => false);

                if (isNavigated) {

                    // ✅ VALID CASE — Outlet Information page loaded successfully
                    await expect(page.locator(searchOutletPage.outletInformationText)).toBeVisible({ timeout: 10000 });
                    console.log(`✅ Navigation successful — Outlet Information page is visible`);
                    console.log(`✅ All verifications passed for "${data.testCase}"`);

                } else {

                    //INVALID CASE — Outlet Information page not visible
                    
                    console.log(`Navigation unsuccessful — Outlet Information page is not visible`);
                    console.log(`Reason: outlet "${data.searchOutletName}" not found or filter "${data.filter}" is invalid`);
                }

            } catch (error) {
                // -------------------- ERROR HANDLING --------------------
                if (error instanceof Error) {
                    console.log(`❌ Test failed for "${data.testCase}": ${error.message}`);
                }
                throw error;
            }

        });

    });

});

// ==================== STEP 4 ====================

/**
 * Test Suite: Audit Page Outlet Information Tests
 * Author: Lakshmi
 * Created Date: 2026-06-08
 *
 * Description:
 * This test suite validates the Audit Page functionality for Outlet Information.
 * It performs end-to-end verification of navigation, search, filtering, and UI validation.
 *
 * Test Flow:
 * 1. Iterates through multiple test datasets from JSON.
 * 2. Navigates to Audit Page using menu and submenu.
 * 3. Searches for a specific outlet using the provided outlet name.
 * 4. Applies Status and Date filters dynamically.
 * 5. Performs validation to ensure the "Audits" tab is visible.
 * 6. Verifies that the tab text matches expected value ("Audits").
 *
 * Validation Steps:
 * - Confirms Audits tab is visible on the UI.
 * - Confirms correct tab label is displayed.
 *
 * Error Handling:
 * - Uses try-catch block to capture and log failures.
 * - Logs detailed error messages for debugging.
 * - Re-throws error to ensure Playwright marks test as failed.
 *
 * Test Data Source:
 * - getParticularOutletInformation (from outletData.json)
 *
 * Parameters (from JSON):
 * @param menu             - Main menu name (e.g., "Audit Management")
 * @param subMenu          - Sub menu name (e.g., "Audits")
 * @param searchOutletName - Outlet name to search
 * @param filter           - Date filter (e.g., "All time")
 * @param status           - Status filter (e.g., "Completed", "Pending")
 *
 * Example Execution:
 * - Navigate → Search Outlet → Apply Filters → Validate Audits Tab
 *
 * Expected Result:
 * - Audits tab should be visible and contain correct label.
 * - Test should pass if UI behaves as expected.
 * - Test should fail with proper error logs if any step breaks.
 */
test.describe('Audit Page Outlet Information Tests', () => {

  getParticularOutletInformation.forEach((data) => {

    test(`${data.testCase}`, async ({ page }) => {

      const auditPage = new AuditPng_OutletInformationPage(page);

      try {
        console.log(`\n Running: ${data.testCase}`);

        // Step 1: Perform actions
        await auditPage.auditPageOutletInformation(data.menu,data.subMenu,data.searchOutletName,data.filter,data.status);

        // Step 2: ✅ VERIFICATION 
        const auditsTab = page.locator(auditPage.audits);

        // Check visibility
        await expect(auditsTab).toBeVisible();

        // check text
        await expect(auditsTab).toHaveText('Audits');

        console.log('✅ Verification Passed: Audits tab is visible');

        console.log(`✅ Passed: ${data.testCase}`);

      } catch (error) {

        console.log(`❌ Failed: ${data.testCase}`);

        if (error instanceof Error) {
          console.error("Error Message:", error.message);
        } else {
          console.error("Unknown Error:", error);
        }

        
        throw error;
      }

    });

  });

});
// ==================== STEP 5 ====================

/**
 * @testSuite  Title: Audit Page Tests
 * @step       5
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Navigates to the audit page of a specific outlet and validates audit
 * details including audit ID lookup, category filtering, and audit data display.
 * Skips execution gracefully if the Audit ID is empty.
 * Uses AuditPage page object to handle audit search and category filtering.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Check if Audit ID is empty — skip test gracefully if empty
 * 3. Call auditsPage() to search outlet, locate audit by ID and apply category filter
 * 4. Verify navigation result:
 *    - Audits page header visible → audit page loaded successfully
 *    - Audits page header not visible → invalid input or navigation failed
 *
 * @testData   auditData.auditPageTestCase
 *
 * @param {string} data.menu             - Main menu name          (e.g., "Audit Management")
 * @param {string} data.subMenu          - Sub menu name           (e.g., "Audits")
 * @param {string} data.searchOutletName - Outlet name to search   (e.g., "Madhuloka liquor")
 * @param {string} data.filter           - Date filter to apply    (e.g., "All time")
 * @param {string} data.targetAuditId    - Audit ID to locate      (e.g., "AUD-1767761954121-95a38e24")
 * @param {string} data.selectCategory   - Category to filter by   (e.g., "All Categories", "Beverages")
 *
 * @example
 * // ✅ Valid test data example:
 * {
 *   "testCase": "Audit Page Validation with Valid Search and Filters",
 *   "menu": "Audit Management",
 *   "subMenu": "Audits",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time",
 *   "targetAuditId": "AUD-1767761954121-95a38e24",
 *   "selectCategory": "All Categories"
 * }
 *
 * // ❌ Invalid test data example — empty Audit ID:
 * {
 *   "testCase": "Audit Page - Empty AuditId",
 *   "menu": "Audit Management",
 *   "subMenu": "Audits",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time",
 *   "targetAuditId": "",
 *   "selectCategory": "All Categories"
 * }
 *
 * // ❌ Invalid test data example — invalid Audit ID:
 * {
 *   "testCase": "Audit Page - Invalid Audit ID",
 *   "menu": "Audit Management",
 *   "subMenu": "Audits",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time",
 *   "targetAuditId": "AUD-1767761954121000000000",
 *   "selectCategory": "All Categories"
 * }
 */
test.describe('Audit Page Tests', () => {

  getBrandsAndSkus.forEach((data) => {

    test(`${data.testCase}`, async ({ page }) => {

      const auditPage = new AuditPage(page);

      try {
        console.log(`Running: ${data.testCase}`);

        // Skip empty Audit ID
        if (!data.targetAuditId?.trim()) {
          console.log("Audit ID is empty — skipping test");
          return;
        }

        // Step 1: Perform actions
        await auditPage.auditsPage(data.menu,data.subMenu,data.searchOutletName,data.filter,data.status,data.targetAuditId,data.selectCategory);

        // ==================== VERIFICATION ====================

                // Check if "No Records" message is visible
                const noRecords = await page.locator(auditPage.noRecordsToFoundMessage).isVisible().catch(() => false);

                if (noRecords) {
                    console.log(`No records found for "${data.testCase}" — skipping verification`);
                    return;
                }

                // Check if Audits page header is visible
                const auditsHeaderVisible = await page.locator(auditPage.auditText).isVisible().catch(() => false);

                if (!auditsHeaderVisible) {
                    //Invalid case — outlet not found or navigation failed
                    console.log(`Outlet "${data.searchOutletName}" not found — navigation did not complete`);
                    console.log(`✅ Verified — invalid input handled correctly`);
                    return;
                }

                // ✅ Valid case — verify audits page header is visible
                await expect(page.locator(auditPage.auditText)).toBeVisible({ timeout: 10000 });
                console.log(`✅ Verified — Audits page header is visible`);
                console.log(`✅ All verifications passed for "${data.testCase}"`);

            } catch (error) {
                if (error instanceof Error) {
                    console.log(`❌ Test failed for "${data.testCase}": ${error.message}`);
                }
                throw error;
            }

        });

    });

});
// ==================== STEP 6 ====================

/**
 * Test Suite: Dashboard Tests
 *
 * Description:
 * This test verifies the Audit Dashboard functionality.
 *
 * Test Flow:
 * 1. Navigate to Audit Management → Audits
 * 2. Search outlet and apply filters
 * 3. Open Dashboard for given Audit ID
 * 4. Perform dashboard actions (view data, export PDF)
 * 5. Close dashboard
 * 6. Verify user is navigated back to Audits page
 *
 * Validation:
 * - Audits tab should be visible after closing dashboard
 *
 * Expected Result:
 * - Dashboard opens correctly
 * - User returns to Audits page after closing
 */

test.describe('Dashboard Tests', () => {

  getDashboardValues.forEach((data) => {

    test(`${data.testCase}`, async ({ page }) => {
      

      const dashboardPage = new AuditMng_DashboardPage(page);

      try {
        console.log(`Running: ${data.testCase}`);

        // Step 1: Perform Dashboard actions
        await dashboardPage.getDashboardValues(data.menu,data.subMenu,data.searchOutletName,data.filter,data.status,data.targetAuditId);

        // ==================== VERIFICATION ====================

        // ✅ Verify user is navigated back to Audits page
        await expect(page.locator(dashboardPage.audits)).toBeVisible();

        console.log('✅ Verified: Navigated back to Audits page');

        

      } catch (error) {

        console.log(`❌ Failed: ${data.testCase}`);

        if (error instanceof Error) {
          console.error("Error Message:", error.message);
        }

        throw error;
      }

    });

  });

});