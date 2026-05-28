import { Page, expect } from "@playwright/test";

export class productCategory {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    // Top-level Product Management menu item in the sidebar
    lnkProductManagementMenu = "//span[text()='Product Management']";

    // Categories submenu item under Product Management
    // Uses class 'lan-5' to precisely target the Categories link
    lnkProductSubmenu = "//span[@class='lan-5' and text()='Categories']";

    // Main page title heading on the Category Taxonomy listing page
    categoryPageTitle = "//h1[text()='Category Taxonomy']";

    // Category name spans in the table — excludes pagination ancestors to avoid false matches
    categoryNames = "//span[@class='fw-bold text-dark' and not(ancestor::div[contains(@class,'pagination')])]";

    // ==================== METHODS ====================

    /**
     * @function getAllCategoryNames
     * @author Bhavani
     * @date 2026-05-12
     * @description Navigates to the Product Management → Categories page and
     * fetches all category names across all paginated pages.
     * Performs the following steps:
     *  1. Checks visibility of Product Management menu and clicks it
     *  2. Waits for and clicks the Categories submenu item
     *  3. Waits for the Category Taxonomy page title to confirm navigation
     *  4. Loops through all paginated pages:
     *     - Waits for the react-data-table body to load
     *     - Fetches category name spans from column 2
     *     - Adds names to the master array
     *     - Checks Next button visibility and disabled state
     *     - Clicks Next and waits for next page to load
     *  5. Prints a full summary of all category names fetched
     *
     * @returns {Promise<string[]>}
     * Returns an array of all category name strings collected across all pages
     *
     * @example
     * const categoryPage = new productCategory(page);
     * const categories = await categoryPage.getAllCategoryNames();
     * console.log(categories);
     * // Output: ["BIO_WHISKY_SCOTCH", "BIO_VODKA", "BIO_OTHERS", ...]
     */
    async getAllCategoryNames(): Promise<string[]> {

        // Array to store all collected category names across all pages
        const allCategoryNames: string[] = [];

        // Tracks current pagination page number for logging
        let pageNumber = 1;

        console.log("=== GET ALL CATEGORY NAMES START ===");

        // -------------------- NAVIGATION SECTION --------------------

        // Step 1: Check visibility of Product Management menu and click it
        console.log("Step 1: Checking Product Management menu visibility");
        const isMenuVisible = await this.page.locator(this.lnkProductManagementMenu).isVisible();
        console.log(`ℹ️ Product Management menu visible: ${isMenuVisible}`);

        if (!isMenuVisible) {
            console.log("❌ Product Management menu not visible — aborting");
            return allCategoryNames;
        }

        await this.page.locator(this.lnkProductManagementMenu).click();
        console.log("✅ Product Management menu clicked");

        // Step 2: Wait for Categories submenu to appear and click it
        console.log("Step 2: Waiting for Categories submenu to be visible");
        await this.page.locator(this.lnkProductSubmenu).waitFor({ state: 'visible' });
        const isSubMenuVisible = await this.page.locator(this.lnkProductSubmenu).isVisible();
        console.log(`ℹ️ Categories submenu visible: ${isSubMenuVisible}`);

        if (!isSubMenuVisible) {
            console.log("❌ Categories submenu not visible — aborting");
            return allCategoryNames;
        }

        await this.page.locator(this.lnkProductSubmenu).click();
        console.log("✅ Categories submenu clicked");

        // Step 3: Wait for Category Taxonomy page title to confirm page loaded correctly
        console.log("Step 3: Waiting for Category Taxonomy page title to be visible");
        await this.page.locator(this.categoryPageTitle).waitFor({ state: 'visible' });
        const isTitleVisible = await this.page.locator(this.categoryPageTitle).isVisible();
        console.log(`ℹ️ Category page title visible: ${isTitleVisible}`);

        if (isTitleVisible) {
            console.log("✅ Category Taxonomy page loaded successfully");
        } else {
            console.log("❌ Category page title not visible — aborting");
            return allCategoryNames;
        }

        // -------------------- PAGINATION LOOP SECTION --------------------

        // Step 4: Loop through all paginated pages until Next button is gone or disabled
        console.log("\nStep 4: Starting pagination loop to collect all category names");

        while (true) {
            console.log(`\n--- Page ${pageNumber} ---`);

            // Step 4.x.1: Wait for react-data-table body to be visible on current page
            console.log(`Step 4.${pageNumber}.1: Waiting for table body to load on page ${pageNumber}`);
            await this.page.locator(`//div[contains(@class,'rdt_TableBody')]`)
                .waitFor({ state: 'visible' });
            console.log(`✅ Table body loaded on page ${pageNumber}`);

            // Step 4.x.2: Fetch all category name spans from column 2 inside table body
            // Scoped inside rdt_TableBody and data-column-id='2' to exclude header and pagination values
            console.log(`Step 4.${pageNumber}.2: Fetching category names from column 2 on page ${pageNumber}`);
            const pageNames = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='2']//span[@class='fw-bold text-dark']`
            ).allTextContents();

            console.log(`Step 4.${pageNumber}.3: Found ${pageNames.length} category names on page ${pageNumber}`);

            // Warn if no names found — may indicate selector issue
            if (pageNames.length === 0) {
                console.log(`⚠️ No category names found on page ${pageNumber} — check XPath selector`);
            } else {
                console.log(`ℹ️ Page ${pageNumber} category names:`);
                pageNames.forEach((name, index) => {
                    console.log(`   ${index + 1}. ${name.trim()}`);
                });
            }

            // Step 4.x.3: Add current page names to master array
            allCategoryNames.push(...pageNames);
            console.log(`Step 4.${pageNumber}.4: Total category names collected so far: ${allCategoryNames.length}`);

            // Step 4.x.4: Check if Next button is visible to determine if more pages exist
            console.log(`Step 4.${pageNumber}.5: Checking Next button visibility on page ${pageNumber}`);
            const nextButton = this.page.locator(
                `//div[contains(@class,'pagination-footer')]//button[contains(.,'Next')]`
            );
            const isVisible = await nextButton.isVisible().catch(() => false);
            console.log(`ℹ️ Next button visible: ${isVisible}`);

            // If Next button not visible — we are on the last page
            if (!isVisible) {
                console.log(`✅ Next button not visible — reached last page (page ${pageNumber})`);
                break;
            }

            // Step 4.x.5: Check if Next button is disabled — also indicates last page
            const isDisabled = await nextButton.isDisabled().catch(() => true);
            console.log(`ℹ️ Next button disabled: ${isDisabled}`);

            if (isDisabled) {
                console.log(`✅ Next button is disabled — reached last page (page ${pageNumber})`);
                break;
            }

            // Step 4.x.6: Click Next button to navigate to the next page
            console.log(`Step 4.${pageNumber}.6: Clicking Next button → navigating to page ${pageNumber + 1}`);
            await nextButton.click();
            console.log(`✅ Next button clicked`);

            // Step 4.x.7: Wait for next page to load before continuing the loop
            console.log(`Step 4.${pageNumber}.7: Waiting for page ${pageNumber + 1} content to load`);
            await this.page.waitForTimeout(2000);
            console.log(`✅ Wait complete`);

            // Increment page counter
            pageNumber++;
            console.log(`✅ Now on page ${pageNumber}`);
        }

        // -------------------- FINAL SUMMARY SECTION --------------------

        // Step 5: Print complete summary of all category names fetched across all pages
        console.log("\n=== ALL CATEGORY NAMES SUMMARY ===");

        if (allCategoryNames.length === 0) {
            console.log("❌ No category names found — check XPath selectors or navigation");
        } else {
            console.log(`ℹ️ Printing all ${allCategoryNames.length} category names:`);
            allCategoryNames.forEach((name, index) => {
                console.log(`  ${index + 1}. ${name.trim()}`);
            });
        }

        console.log(`\n✅ Total Categories fetched : ${allCategoryNames.length}`);
        console.log(`✅ Total Pages visited      : ${pageNumber}`);
        console.log("=== GET ALL CATEGORY NAMES END ===");

        return allCategoryNames;
    }
}