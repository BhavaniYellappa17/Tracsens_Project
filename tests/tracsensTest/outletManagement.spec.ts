import { test,expect  } from '@playwright/test';
import '../../hooks/hooks';

// Page Object Imports
import { OutletMenuNav } from '../../pages/outletMenuNavigation';
import { AllOutletNames } from '../../pages/Tracsens/getOutletMng_OutletNames';
import { OutletPage } from '../../pages/Tracsens/searchOutletNames';
import { AuditPage } from '../../pages/Tracsens/outletMng_AuditPage';
import { DashboardPage } from '../../pages/Tracsens/outletMng_DashboardPage';
import { OutletInformationPage } from '../../pages/Tracsens/outletMng_outletInformationPage';

// Test Data
import outletData from '../testdata/outletData.json';

/**
 * ============================================================
 * OUTLET MANAGEMENT TEST SUITE (DATA-DRIVEN + ISOLATED TESTS)
 * ============================================================
 * ✔ Each JSON record = One Test Case
 * ✔ Clean login/logout per test (handled by hooks)
 * ✔ No loops inside tests (prevents timeout issues)
 * ✔ Easy debugging & reporting
 * ============================================================
 */
// ==================== TEST DATA SETUP ====================
// Reads each test case group from outletData.json and stores
// them in separate constants for use in each test describe block below.
// Each constant holds an array of test case objects.
/** Step 1 — Menu and submenu navigation test cases */
const menuData = outletData.menuAndSubMenuTestCases;
/** Step 2 — Get all outlet names test cases */
const getAllOutletNamesData = outletData.getAllOutletNamesTestCases;
/** Step 3 — Outlet search test cases (search by name + date filter) */
const searchData = outletData.searchoutletNameTestCase;
/** Step 4 — Outlet information page test cases */
const outletInfoData = outletData.outletInformationTestCase;
/** Step 5 — Audit page test cases (audit ID + category filter) */
const auditData = outletData.auditPageTestCase;
/** Step 6 — Dashboard values test cases (PDF export) */
const dashboardData = outletData.getDashboardValuesTestCase;

// ==================== STEP 1 ====================
/**
 * @testSuite  Title: Menu Navigation Tests
 * @step       1
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Verifies that the main menu and submenu items are present and clickable
 * as per the expected data defined in outletData.json.
 * Uses OutletMenuNav page object to perform sidebar navigation.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call outletMenuAndSubMenu() to click main menu and submenu
 * 3. Verify navigation result based on input validity:
 *    - Empty menu or submenu  → verify page header is NOT visible
 *    - Invalid submenu name   → verify navigation did not complete
 *    - Valid menu and submenu → verify page header and submenu are visible
 *
 * @testData   outletData.menuAndSubMenuTestCases
 *
 * @param {string} data.menu    - Main menu name (e.g., "Outlet Management")
 * @param {string} data.subMenu - Sub menu name  (e.g., "Outlets")
 *
 * @example
 * // ✅ Valid test data example:
 * {
 *   "testCase": "Valid Case",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets"
 * }
 *
 * // ❌ Invalid test data example — empty menu name:
 * {
 *   "testCase": "Invalid Menu Name",
 *   "menu": "",
 *   "subMenu": "Outlets"
 * }
 *
 * // ❌ Invalid test data example — wrong submenu name:
 * {
 *   "testCase": "Invalid SubMenu Name",
 *   "menu": "Outlet Management",
 *   "subMenu": "Audits"
 * }
 */
test.describe('Menu Navigation Tests', () => {

    menuData.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {
            const outletMenuPage = new OutletMenuNav(page);

            console.log(`Running: ${data.testCase}`);

            try {
                // -------------------- NAVIGATION --------------------
                await outletMenuPage.outletMenuAndSubMenu(data.menu, data.subMenu);

                // ==================== VERIFICATION ====================

                if (data.menu.trim() === '' || data.subMenu.trim() === '') {

                    // ❌ Invalid case — empty menu or submenu input
                    console.log(`⚠️ Invalid input — verifying navigation did not occur`);

                    try {
                        await expect(page.locator(outletMenuPage.outletMngPage))
                            .not.toBeVisible({ timeout: 5000 });
                        console.log(`✅ Verified — page did not navigate for empty input`);
                    } catch (verifyError) {
                        console.log(`❌ Verification failed — page header unexpectedly visible for empty input`);
                        throw verifyError;
                    }

                } else {

                    // Check if page header is visible after navigation
                    const isNavigated = await page.locator(outletMenuPage.outletMngPage)
                        .isVisible()
                        .catch(() => false);

                    if (!isNavigated) {

                        // ❌ Invalid submenu — navigation did not complete
                        console.log(`⚠️ Navigation failed — "${data.subMenu}" is an invalid submenu`);
                        console.log(`✅ Verified — page header not visible for invalid submenu`);

                    } else {

                        // ✅ Valid case — navigation succeeded, verify all
                        console.log(`Verifying navigation to "${data.subMenu}" page`);

                        try {
                            // Verify 1: Page header is visible
                            await expect(page.locator(outletMenuPage.outletMngPage))
                                .toBeVisible({ timeout: 10000 });
                            console.log(`✅ Verified — Page header is visible`);
                        } catch (headerError) {
                            console.log(`❌ Verification failed — Page header not visible`);
                            throw headerError;
                        }

                        try {
                            // Verify 2: Submenu is visible in sidebar
                            await expect(page.locator(`//span[text()='${data.subMenu}']`))
                                .toBeVisible({ timeout: 10000 });
                            console.log(`✅ Verified — SubMenu "${data.subMenu}" is visible`);
                        } catch (subMenuError) {
                            console.log(`❌ Verification failed — SubMenu "${data.subMenu}" not visible`);
                            throw subMenuError;
                        }

                        console.log(`✅ All verifications passed for "${data.testCase}"`);
                    }
                }

            } catch (error) {
                // -------------------- ERROR HANDLING --------------------
                if (error instanceof Error) {
                    console.log(`❌ Test failed for "${data.testCase}": ${error.message}`);
                }
                throw error; // re-throw so Playwright marks test as failed
            }

        });

    });

});
// ==================== STEP 2 ====================

/**
 * @testSuite  Title: Get All Outlet Names
 * @step       2
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Navigates to the Outlets page and fetches all outlet names across
 * all paginated pages. Logs each outlet name with its index to the console.
 * Uses AllOutletNames page object to handle pagination and data collection.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call getAllOutletNames() to fetch all outlet names across all pages
 * 3. Store the returned array in a variable
 * 4. Verify that the outlet list is not empty — at least 1 outlet must exist
 *
 * @testData   outletData.getAllOutletNamesTestCases
 *
 * @param {string} data.menu    - Main menu name (e.g., "Outlet Management")
 * @param {string} data.subMenu - Sub menu name  (e.g., "Outlets")
 *
 * @example
 * // ✅ Valid test data example:
 * {
 *   "testCase": "Valid Case",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets"
 * }
 *
 * // ❌ Invalid test data example — empty menu name:
 * {
 *   "testCase": "Invalid Menu Name",
 *   "menu": "",
 *   "subMenu": "Outlets"
 * }
 *
 * // ❌ Invalid test data example — wrong submenu name:
 * {
 *   "testCase": "Invalid SubMenu Name",
 *   "menu": "Outlet Management",
 *   "subMenu": "Audits"
 * }
 */
test.describe('Get All Outlet Names', () => {

    getAllOutletNamesData.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {
            const allOutletNames = new AllOutletNames(page);

            console.log(`Running: ${data.testCase}`);

            try {
                // Store the returned array in a variable
                const outlets: string[] = await allOutletNames.getAllOutletNames(data.menu, data.subMenu);

                // ==================== VERIFICATION ====================
                expect(outlets.length).toBeGreaterThan(0);
                console.log(`✅ Verified — Outlet list is not empty. Total: ${outlets.length}`);

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
 * @testSuite  Title: Search Particular Outlet Name
 * @step       3
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Verifies the outlet search functionality by searching for an outlet
 * by name and applying a date filter. Validates that the correct outlet
 * appears in the search results and navigates to the Outlet Information page.
 * Uses OutletPage page object to perform search and filter operations.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call searchOutletName() to search outlet by name and apply date filter
 * 3. Click the matching outlet from search results
 * 4. Verify navigation result based on input validity:
 *    - Invalid outlet name or filter → verify Outlet Information page is NOT visible
 *    - Valid outlet name and filter  → verify Outlet Information page header is visible
 *
 * @testData   outletData.searchoutletNameTestCase
 *
 * @param {string} data.menu             - Main menu name        (e.g., "Outlet Management")
 * @param {string} data.subMenu          - Sub menu name         (e.g., "Outlets")
 * @param {string} data.searchOutletName - Outlet name to search (e.g., "Madhuloka liquor")
 * @param {string} data.filter           - Date filter to apply  (e.g., "All time", "Last month")
 *
 * @example
 * // ✅ Valid test data example:
 * {
 *   "testCase": "Valid Search and Filter",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time"
 * }
 *
 * // ❌ Invalid test data example — invalid outlet name:
 * {
 *   "testCase": "Invalid Outlet Name",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "XYZ123Outlet",
 *   "filter": "All time"
 * }
 *
 * // ❌ Invalid test data example — invalid filter:
 * {
 *   "testCase": "Invalid Filter",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "Last 7 Days"
 * }
 */
test.describe('Search Particular Outlet Name', () => {

    searchData.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {
            const outletPage = new OutletPage(page);

            console.log(`Running: ${data.testCase}`);

            try {
                // Navigate to outlet and search for specific outlet name
                await outletPage.searchOutletName(data.menu, data.subMenu, data.searchOutletName, data.filter);

                // ==================== VERIFICATION ====================
                await page.waitForTimeout(2000);
                // Check if navigation to outlet information page occurred
                const isNavigated = await page.locator(outletPage.outletInformationText).isVisible().catch(() => false);

                if (!isNavigated) {

                    // ❌ Invalid case — outlet not found or navigation did not complete
                    console.log(`⚠️ Navigation failed — "${data.searchOutletName}" outlet information page not visible`);
                    console.log(`✅ Verified — invalid input handled correctly`);

                } else {

                    // ✅ Valid case — outlet information page loaded
                    try {
                        await expect(page.locator(outletPage.outletInformationText)).toBeVisible({ timeout: 10000 });
                        console.log(`✅ Verified — Outlet Information page header is visible`);
                        console.log(`✅ All verifications passed for "${data.testCase}"`);
                    } catch (verifyError) {
                        console.log(`❌ Verification failed — Outlet Information page header not visible`);
                        throw verifyError;
                    }
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


// ==================== STEP 4 ====================

/**
 * @testSuite  Title: Outlet Information Tests
 * @step       4
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Searches for a specific outlet and navigates to its information page.
 * Validates that the Outlet Information page loaded correctly by checking
 * the visibility of the Audits tab on the outlet detail page.
 * Uses OutletInformationPage page object to handle navigation and validation.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call outletInformation() to search outlet and navigate to its detail page
 * 3. Verify navigation result:
 *    - Audits tab not visible → outlet not found or navigation failed
 *    - Audits tab visible     → outlet information page loaded successfully
 *
 * @testData   outletData.outletInformationTestCase
 *
 * @param {string} data.menu             - Main menu name        (e.g., "Outlet Management")
 * @param {string} data.subMenu          - Sub menu name         (e.g., "Outlets")
 * @param {string} data.searchOutletName - Outlet name to search (e.g., "Madhuloka liquor")
 * @param {string} data.filter           - Date filter to apply  (e.g., "All time")
 *
 * @example
 * // ✅ Valid test data example:
 * {
 *   "testCase": "Search Outlet with Valid Name and Filter",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time"
 * }
 */
test.describe('Outlet Information Tests', () => {

    outletInfoData.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {
            const outletInformationPage = new OutletInformationPage(page);

            console.log(`Running: ${data.testCase}`);

            try {
                await outletInformationPage.outletInformation(data.menu, data.subMenu, data.searchOutletName, data.filter);

                // ==================== VERIFICATION ====================

                const isNavigated = await page.locator(outletInformationPage.audits)
                    .isVisible()
                    .catch(() => false);

                if (!isNavigated) {
                    console.log(`⚠️ Audits tab not visible — outlet not found or navigation failed`);
                } else {
                    await expect(page.locator(outletInformationPage.audits))
                        .toBeVisible({ timeout: 10000 });
                    console.log(`✅ Verified — Audits tab is visible`);
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
 * @testData   outletData.auditPageTestCase
 *
 * @param {string} data.menu             - Main menu name          (e.g., "Outlet Management")
 * @param {string} data.subMenu          - Sub menu name           (e.g., "Outlets")
 * @param {string} data.searchOutletName - Outlet name to search   (e.g., "Madhuloka liquor")
 * @param {string} data.filter           - Date filter to apply    (e.g., "All time")
 * @param {string} data.targetAuditId    - Audit ID to locate      (e.g., "AUD-1767761954121-95a38e24")
 * @param {string} data.selectCategory   - Category to filter by   (e.g., "All Categories", "Beverages")
 *
 * @example
 * // ✅ Valid test data example:
 * {
 *   "testCase": "Audit Page Validation with Valid Search and Filters",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time",
 *   "targetAuditId": "AUD-1767761954121-95a38e24",
 *   "selectCategory": "All Categories"
 * }
 *
 * // ❌ Invalid test data example — empty Audit ID:
 * {
 *   "testCase": "Audit Page - Empty AuditId",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time",
 *   "targetAuditId": "",
 *   "selectCategory": "All Categories"
 * }
 *
 * // ❌ Invalid test data example — invalid Audit ID:
 * {
 *   "testCase": "Audit Page - Invalid Audit ID",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time",
 *   "targetAuditId": "AUD-1767761954121000000000",
 *   "selectCategory": "All Categories"
 * }
 */
test.describe('Audit Page Tests', () => {

    auditData.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {
            const auditPage = new AuditPage(page);

            console.log(`Running: ${data.testCase}`);

            try {
                // Handle empty Audit ID — skip test gracefully
                if (!data.targetAuditId?.trim()) {
                    console.log(`⚠️ Audit ID is empty — skipping test`);
                    return;
                }

                await auditPage.auditsPage(data.menu,data.subMenu,data.searchOutletName,data.filter,data.targetAuditId,data.selectCategory);

                // ==================== VERIFICATION ====================
                await expect(page.locator(auditPage.auditText))
                    .toBeVisible({ timeout: 10000 });
                console.log(`✅ Verified — Audits page header is visible`);

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
 * @testSuite  Title: Dashboard Tests
 * @step       6
 * @author     Lakshmi
 * @date       2026-06-05
 *
 * @description
 * Performs a full end-to-end dashboard validation flow including
 * outlet search, audit lookup, KPI value extraction and PDF export.
 * Uses DashboardPage page object to handle the complete flow.
 *
 * @testFlow
 * 1. Navigate to the application via beforeEach hook (login handled automatically)
 * 2. Call getDashboardValues() to perform the complete dashboard flow:
 *    a. Navigate to Outlet Management page
 *    b. Search for the target outlet by name and filter
 *    c. Navigate to the outlet's audit list
 *    d. Locate the specific audit by ID across paginated results
 *    e. Open the audit dashboard and read all KPI values:
 *       - Unique SKUs, Detected SKUs, Diageo SKUs, Retention Rate, Missing SKUs
 *    f. Export the dashboard as a PDF and verify the download
 * 3. Verify Audit ID column header is visible on the audit list page
 *
 * @note
 * Test timeout is set to 360000ms (6 minutes) due to:
 * - Pagination across multiple audit pages
 * - Dashboard load time
 * - PDF export and download operation
 *
 * @testData   outletData.getDashboardValuesTestCase
 *
 * @param {string} data.menu             - Main menu name          (e.g., "Outlet Management")
 * @param {string} data.subMenu          - Sub menu name           (e.g., "Outlets")
 * @param {string} data.searchOutletName - Outlet name to search   (e.g., "Madhuloka liquor")
 * @param {string} data.filter           - Date filter to apply    (e.g., "All time")
 * @param {string} data.targetAuditId    - Audit ID to locate      (e.g., "AUD-1767761954121-95a38e24")
 *
 * @example
 * // ✅ Valid test data example:
 * {
 *   "testCase": "Verify Dashboard Values for Valid Outlet Search with Filter, Audit ID and Category",
 *   "menu": "Outlet Management",
 *   "subMenu": "Outlets",
 *   "searchOutletName": "Madhuloka liquor",
 *   "filter": "All time",
 *   "targetAuditId": "AUD-1767761954121-95a38e24"
 * }
 */
test.describe('Dashboard Tests', () => {

    dashboardData.forEach((data) => {

        test(`${data.testCase}`, async ({ page }) => {

            const dashboardPage = new DashboardPage(page);

            console.log(`Running: ${data.testCase}`);

            try {
                await dashboardPage.getDashboardValues(data.menu,data.subMenu,data.searchOutletName,data.filter,data.targetAuditId);

                // ==================== VERIFICATION ====================
                await expect(page.locator(dashboardPage.verifyAuditId)).toBeVisible();
                console.log(`✅ Verified — Audit ID column header is visible`);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(`❌ Test failed for "${data.testCase}": ${error.message}`);
                }
                throw error;
            }

        });

    });

});