import { Page } from "@playwright/test";

export class productList {

    constructor(public page: Page) {
        this.page = page;
    }

    // Locators
    lnkProductManagementMenu = "//span[text()='Product Management']";
    lnkProductSubmenu        = "(//span[contains(text(),'Products') and not(contains(text(),'Product Management'))])[1]";
    productPageTitle         = "//h1";

    async getAllProductNamesAndSKUs(): Promise<{ name: string; sku: string }[]> {
        const allProducts: { name: string; sku: string }[] = [];
        let pageNumber = 1;

        console.log("=== GET ALL PRODUCT NAMES & SKUs START ===");

        // Step 1: Click Product Management menu
        console.log("Step 1: Clicking Product Management menu");
        const isMenuVisible = await this.page.locator(this.lnkProductManagementMenu).isVisible();
        if (!isMenuVisible) {
            console.log("❌ Product Management menu not visible");
            return allProducts;
        }
        await this.page.locator(this.lnkProductManagementMenu).click();
        console.log("✅ Product Management menu clicked");

        // Step 2: Click Products submenu
        console.log("Step 2: Waiting for Products submenu");
        await this.page.locator(this.lnkProductSubmenu).waitFor({ state: 'visible' });
        const isSubMenuVisible = await this.page.locator(this.lnkProductSubmenu).isVisible();
        if (!isSubMenuVisible) {
            console.log("❌ Products submenu not visible");
            return allProducts;
        }
        await this.page.locator(this.lnkProductSubmenu).click();
        console.log("✅ Products submenu clicked");

        // Step 3: Wait for product page to load
        console.log("Step 3: Waiting for Product page to load");
        await this.page.locator(`//div[contains(@class,'rdt_TableBody')]`).waitFor({ state: 'visible', timeout: 30000 });
        console.log("✅ Product page loaded successfully");

        // Step 4: Loop through all pages
        while (true) {
            console.log(`\n--- Page ${pageNumber} ---`);

            // Wait for table body to be visible
            console.log(`Step 4.${pageNumber}.1: Waiting for table to load`);
            await this.page.locator(`//div[contains(@class,'rdt_TableBody')]`).waitFor({ state: 'visible', timeout: 30000 });
            console.log(`✅ Table loaded on page ${pageNumber}`);

            // Wait for first row to be rendered
            await this.page.locator(`//div[contains(@class,'rdt_TableBody')]//div[contains(@class,'rdt_TableRow')]`)
                .first()
                .waitFor({ state: 'visible', timeout: 30000 });
            console.log(`✅ First row visible on page ${pageNumber}`);

            // Fetch product names
            console.log(`Step 4.${pageNumber}.2: Fetching product names`);
            const nameElements = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='2']`
            ).allTextContents();

            // Fetch SKU values
            console.log(`Step 4.${pageNumber}.3: Fetching SKU values`);
            const skuElements = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='3']//a`
            ).allTextContents();

            console.log(`Step 4.${pageNumber}.4: Found ${nameElements.length} names and ${skuElements.length} SKUs on page ${pageNumber}`);

            // Pair names and SKUs
            const count = Math.min(nameElements.length, skuElements.length);
            for (let i = 0; i < count; i++) {
                const name = nameElements[i].trim();
                const sku  = skuElements[i].trim();
                if (name && sku) {
                    allProducts.push({ name, sku });
                }
            }

            console.log(`Step 4.${pageNumber}.5: Total products collected so far: ${allProducts.length}`);

            // Print current page products
            console.log(`\n📄 Page ${pageNumber} Products:`);
            for (let i = 0; i < count; i++) {
                const idx = allProducts.length - count + i;
                console.log(`  ${idx + 1}. Name: ${allProducts[idx]?.name} | SKU: ${allProducts[idx]?.sku}`);
            }

            // Check Next button
            console.log(`\nStep 4.${pageNumber}.6: Checking Next button`);
            const nextButton = this.page.locator(`//div[contains(@class,'pagination-footer')]//button[contains(.,'Next')]`);
            const isVisible  = await nextButton.isVisible().catch(() => false);
            console.log(`Next button visible: ${isVisible}`);

            if (!isVisible) {
                console.log(`✅ No Next button - reached last page (page ${pageNumber})`);
                break;
            }

            const isDisabled = await nextButton.isDisabled().catch(() => true);
            console.log(`Next button disabled: ${isDisabled}`);

            if (isDisabled) {
                console.log(`✅ Next button disabled - reached last page (page ${pageNumber})`);
                break;
            }

            // Capture first row text before clicking Next - to detect real page change
            const firstRowTextBefore = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='2']`
            ).first().textContent().catch(() => '');

            // Click Next
            console.log(`Step 4.${pageNumber}.7: Clicking Next → page ${pageNumber + 1}`);
            await nextButton.click();

            // Wait for content to actually change - detects real page transition
            console.log(`Step 4.${pageNumber}.8: Waiting for new page content to load`);
            await this.page.waitForFunction(
                (prevText) => {
                    const firstCell = document.querySelector(`[class*='rdt_TableBody'] [data-column-id='2']`);
                    return firstCell && firstCell.textContent !== prevText;
                },
                firstRowTextBefore,
                { timeout: 30000 }
            );

            // Small buffer for full row render
            await this.page.waitForTimeout(500);

            pageNumber++;
            console.log(`✅ Now on page ${pageNumber}`);
        }

        // Step 5: Print final summary
        console.log("\n=== ALL PRODUCTS SUMMARY ===");
        if (allProducts.length === 0) {
            console.log("❌ No products found - check XPath selectors");
        } else {
            allProducts.forEach((product, index) => {
                console.log(`${index + 1}. Name: ${product.name} | SKU: ${product.sku}`);
            });
        }
        console.log(`\n✅ Total Products fetched: ${allProducts.length}`);
        console.log(`✅ Total Pages visited: ${pageNumber}`);
        console.log("=== GET ALL PRODUCT NAMES & SKUs END ===");

        return allProducts;
    }
}