import { Page } from "@playwright/test";

export class productList {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    // Top-level Product Management menu item in the sidebar
    lnkProductManagementMenu = "//span[text()='Product Management']";

    // Products submenu item under Product Management
    // Uses [1] index and excludes parent menu text to avoid ambiguity
    lnkProductSubmenu = "(//span[contains(text(),'Products') and not(contains(text(),'Product Management'))])[1]";

    // Main page title heading on the Products listing page
    productPageTitle = "//h1";

    // ==================== METHODS ====================

    /**
     * @function getAllProductNamesAndSKUs
     * @author Bhavani
     * @date 2026-05-12
     * @description Navigates to the Product Management → Products page and
     * fetches all product names and SKU values across all paginated pages.
     * Performs the following steps:
     *  1. Clicks the Product Management menu in the sidebar
     *  2. Clicks the Products submenu item
     *  3. Waits for the product table to load
     *  4. Loops through all pages using the Next button:
     *     - Waits for table body and first row to be visible
     *     - Fetches product names from column 2
     *     - Fetches SKU values from column 3 anchor links
     *     - Pairs names and SKUs together
     *     - Prints current page products to console
     *     - Detects real page transition before moving to next page
     *  5. Prints a full summary of all products fetched
     *
     * @returns {Promise<{ name: string; sku: string }[]>}
     * Returns an array of objects, each containing a product name and SKU value
     *
     * @example
     * const productListPage = new productList(page);
     * const products = await productListPage.getAllProductNamesAndSKUs();
     * console.log(products);
     * // Output: [{ name: "AQUA", sku: "AQUA__22X_190ML" }, ...]
     */
    async getAllProductNamesAndSKUs(): Promise<{ name: string; sku: string }[]> {

        // Array to store all collected product name and SKU pairs
        const allProducts: { name: string; sku: string }[] = [];

        // Tracks current pagination page number for logging
        let pageNumber = 1;

        console.log("=== GET ALL PRODUCT NAMES & SKUs START ===");

        // -------------------- NAVIGATION SECTION --------------------

        // Step 1: Check visibility of Product Management menu and click it
        console.log("Step 1: Checking Product Management menu visibility");
        const isMenuVisible = await this.page.locator(this.lnkProductManagementMenu).isVisible();
        console.log(`ℹ️ Product Management menu visible: ${isMenuVisible}`);

        if (!isMenuVisible) {
            console.log("❌ Product Management menu not visible — aborting");
            return allProducts;
        }

        await this.page.locator(this.lnkProductManagementMenu).click();
        console.log("✅ Product Management menu clicked");

        // Step 2: Wait for Products submenu to appear and click it
        console.log("Step 2: Waiting for Products submenu to be visible");
        await this.page.locator(this.lnkProductSubmenu).waitFor({ state: 'visible' });
        const isSubMenuVisible = await this.page.locator(this.lnkProductSubmenu).isVisible();
        console.log(`ℹ️ Products submenu visible: ${isSubMenuVisible}`);

        if (!isSubMenuVisible) {
            console.log("❌ Products submenu not visible — aborting");
            return allProducts;
        }

        await this.page.locator(this.lnkProductSubmenu).click();
        console.log("✅ Products submenu clicked");

        // Step 3: Wait for the product table body to load after navigation
        console.log("Step 3: Waiting for product table to load after navigation");
        await this.page.locator(`//div[contains(@class,'rdt_TableBody')]`)
            .waitFor({ state: 'visible', timeout: 30000 });
        console.log("✅ Product page loaded successfully — table is visible");

        // -------------------- PAGINATION LOOP SECTION --------------------

        // Step 4: Loop through all paginated pages until Next button is disabled or gone
        console.log("\nStep 4: Starting pagination loop to collect all products");

        while (true) {
            console.log(`\n--- Page ${pageNumber} ---`);

            // Step 4.x.1: Wait for table body to be visible on current page
            console.log(`Step 4.${pageNumber}.1: Waiting for table body to load on page ${pageNumber}`);
            await this.page.locator(`//div[contains(@class,'rdt_TableBody')]`)
                .waitFor({ state: 'visible', timeout: 30000 });
            console.log(`✅ Table body loaded on page ${pageNumber}`);

            // Step 4.x.2: Wait for at least the first row to be rendered before fetching data
            console.log(`Step 4.${pageNumber}.2: Waiting for first table row to be visible`);
            await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[contains(@class,'rdt_TableRow')]`
            ).first().waitFor({ state: 'visible', timeout: 30000 });
            console.log(`✅ First row visible on page ${pageNumber}`);

            // Step 4.x.3: Fetch all product name texts from column 2
            console.log(`Step 4.${pageNumber}.3: Fetching product names from column 2`);
            const nameElements = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='2']`
            ).allTextContents();
            console.log(`ℹ️ Product names fetched: ${nameElements.length}`);

            // Step 4.x.4: Fetch all SKU values from anchor links in column 3
            console.log(`Step 4.${pageNumber}.4: Fetching SKU values from column 3 anchor links`);
            const skuElements = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='3']//a`
            ).allTextContents();
            console.log(`ℹ️ SKU values fetched: ${skuElements.length}`);

            console.log(`Step 4.${pageNumber}.5: Found ${nameElements.length} names and ${skuElements.length} SKUs on page ${pageNumber}`);

            // Step 4.x.5: Pair names and SKUs — use minimum count to avoid index mismatch
            const count = Math.min(nameElements.length, skuElements.length);
            console.log(`ℹ️ Pairing ${count} name-SKU pairs from page ${pageNumber}`);

            for (let i = 0; i < count; i++) {
                const name = nameElements[i].trim();
                const sku  = skuElements[i].trim();

                // Only add pair if both name and SKU are non-empty
                if (name && sku) {
                    allProducts.push({ name, sku });
                } else {
                    console.log(`⚠️ Skipping empty pair at index ${i} — name: "${name}" | sku: "${sku}"`);
                }
            }

            console.log(`Step 4.${pageNumber}.6: Total products collected so far: ${allProducts.length}`);

            // Step 4.x.6: Print all products found on current page
            console.log(`\n📄 Page ${pageNumber} Products:`);
            for (let i = 0; i < count; i++) {
                const idx = allProducts.length - count + i;
                console.log(`  ${idx + 1}. Name: ${allProducts[idx]?.name} | SKU: ${allProducts[idx]?.sku}`);
            }

            // Step 4.x.7: Check if Next button is visible to determine if more pages exist
            console.log(`\nStep 4.${pageNumber}.7: Checking Next button visibility`);
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

            // Step 4.x.8: Check if Next button is disabled — last page reached
            const isDisabled = await nextButton.isDisabled().catch(() => true);
            console.log(`ℹ️ Next button disabled: ${isDisabled}`);

            if (isDisabled) {
                console.log(`✅ Next button is disabled — reached last page (page ${pageNumber})`);
                break;
            }

            // Step 4.x.9: Capture first row text before clicking Next
            // This is used to detect when the page has actually changed after clicking Next
            console.log(`Step 4.${pageNumber}.9: Capturing first row text before clicking Next`);
            const firstRowTextBefore = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='2']`
            ).first().textContent().catch(() => '');
            console.log(`ℹ️ First row text before click: "${firstRowTextBefore?.trim()}"`);

            // Step 4.x.10: Click Next button to go to next page
            console.log(`Step 4.${pageNumber}.10: Clicking Next button → navigating to page ${pageNumber + 1}`);
            await nextButton.click();
            console.log(`✅ Next button clicked`);

            // Step 4.x.11: Wait for first row content to change — confirms real page transition
            // Avoids false positives where old DOM is still visible after click
            console.log(`Step 4.${pageNumber}.11: Waiting for page ${pageNumber + 1} content to load`);
            await this.page.waitForFunction(
                (prevText) => {
                    // Check if first cell in table body has changed from previous text
                    const firstCell = document.querySelector(`[class*='rdt_TableBody'] [data-column-id='2']`);
                    return firstCell && firstCell.textContent !== prevText;
                },
                firstRowTextBefore,
                { timeout: 30000 }
            );
            console.log(`✅ Page content changed — new page loaded`);

            // Step 4.x.12: Small buffer to allow all rows to finish rendering
            console.log(`Step 4.${pageNumber}.12: Waiting 500ms buffer for full row render`);
            await this.page.waitForTimeout(500);

            // Move to next page number
            pageNumber++;
            console.log(`✅ Now on page ${pageNumber}`);
        }

        // -------------------- FINAL SUMMARY SECTION --------------------

        // Step 5: Print complete summary of all products fetched across all pages
        console.log("\n=== ALL PRODUCTS SUMMARY ===");

        if (allProducts.length === 0) {
            console.log("❌ No products found — check XPath selectors or navigation");
        } else {
            console.log(`ℹ️ Printing all ${allProducts.length} products:`);
            allProducts.forEach((product, index) => {
                console.log(`  ${index + 1}. Name: ${product.name} | SKU: ${product.sku}`);
            });
        }

        console.log(`\n✅ Total Products fetched : ${allProducts.length}`);
        console.log(`✅ Total Pages visited    : ${pageNumber}`);
        console.log("=== GET ALL PRODUCT NAMES & SKUs END ===");

        return allProducts;
    }
}