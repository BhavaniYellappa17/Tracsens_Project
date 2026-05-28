import { Page, expect } from "@playwright/test";

export class productCategory {

    constructor(public page: Page) {
        this.page = page;
    }

    // Locators
    lnkProductManagementMenu = "//span[text()='Product Management']";
    lnkProductSubmenu = "//span[@class='lan-5' and text()='Categories']";
    categoryPageTitle = "//h1[text()='Category Taxonomy']";
    categoryNames = "//span[@class='fw-bold text-dark' and not(ancestor::div[contains(@class,'pagination')])]";

    async getAllCategoryNames(): Promise<string[]> {
        const allCategoryNames: string[] = [];
        let pageNumber = 1;

        console.log("=== GET ALL CATEGORY NAMES START ===");

        // Step 1: Click Product Management menu
        console.log("Step 1: Clicking Product Management menu");
        const isMenuVisible = await this.page.locator(this.lnkProductManagementMenu).isVisible();
        if (!isMenuVisible) {
            console.log("❌ Product Management menu not visible");
            return allCategoryNames;
        }
        await this.page.locator(this.lnkProductManagementMenu).click();
        console.log("✅ Product Management menu clicked");

        // Step 2: Click Categories submenu
        console.log("Step 2: Waiting for Categories submenu");
        await this.page.locator(this.lnkProductSubmenu).waitFor({ state: 'visible' });
        const isSubMenuVisible = await this.page.locator(this.lnkProductSubmenu).isVisible();
        if (!isSubMenuVisible) {
            console.log("❌ Categories submenu not visible");
            return allCategoryNames;
        }
        await this.page.locator(this.lnkProductSubmenu).click();
        console.log("✅ Categories submenu clicked");

        // Step 3: Wait for category page to load
        console.log("Step 3: Waiting for Category page to load");
        await this.page.locator(this.categoryPageTitle).waitFor({ state: 'visible' });
        const isTitleVisible = await this.page.locator(this.categoryPageTitle).isVisible();
        if (isTitleVisible) {
            console.log("✅ Category page loaded successfully");
        } else {
            console.log("❌ Category page title not visible");
            return allCategoryNames;
        }

        // Step 4: Loop through all pages
        while (true) {
            console.log(`\n--- Page ${pageNumber} ---`);

            // Wait for table to load
            console.log(`Step 4.${pageNumber}.1: Waiting for table to load on page ${pageNumber}`);
            await this.page.locator(`//div[contains(@class,'rdt_TableBody')]`).waitFor({ state: 'visible' });
            console.log(`✅ Table loaded on page ${pageNumber}`);

            // Fetch category names
            console.log(`Step 4.${pageNumber}.2: Fetching category names from page ${pageNumber}`);
            const pageNames = await this.page.locator(
                `//div[contains(@class,'rdt_TableBody')]//div[@data-column-id='2']//span[@class='fw-bold text-dark']`
            ).allTextContents();

            console.log(`Step 4.${pageNumber}.3: Found ${pageNames.length} names on page ${pageNumber}`);

            if (pageNames.length === 0) {
                console.log(`⚠️ No names found on page ${pageNumber} - check XPath selector`);
            } else {
                console.log(`Page ${pageNumber} names:`, pageNames);
            }

            // Add to main array
            allCategoryNames.push(...pageNames);
            console.log(`Step 4.${pageNumber}.4: Total names collected so far: ${allCategoryNames.length}`);

            // Check Next button visibility
            console.log(`Step 4.${pageNumber}.5: Checking Next button on page ${pageNumber}`);
            const nextButton = this.page.locator(`//div[contains(@class,'pagination-footer')]//button[contains(.,'Next')]`);
            const isVisible = await nextButton.isVisible().catch(() => false);
            console.log(`Next button visible: ${isVisible}`);

            if (!isVisible) {
                console.log(`✅ No Next button - reached last page (page ${pageNumber})`);
                break;
            }

            // Check Next button disabled
            const isDisabled = await nextButton.isDisabled().catch(() => true);
            console.log(`Next button disabled: ${isDisabled}`);

            if (isDisabled) {
                console.log(`✅ Next button disabled - reached last page (page ${pageNumber})`);
                break;
            }

            // Click next page
            console.log(`Step 4.${pageNumber}.6: Clicking Next to go to page ${pageNumber + 1}`);
            await nextButton.click();

            console.log(`Step 4.${pageNumber}.7: Waiting for page ${pageNumber + 1} to load`);
            await this.page.waitForTimeout(2000);

            pageNumber++;
            console.log(`✅ Now on page ${pageNumber}`);
        }

        // Step 5: Print all collected names
        console.log("\n=== ALL CATEGORY NAMES ===");
        if (allCategoryNames.length === 0) {
            console.log("❌ No category names found - check XPath or navigation");
        } else {
            allCategoryNames.forEach((name, index) => {
                console.log(`${index + 1}. ${name}`);
            });
        }
        console.log(`✅ Total Categories fetched: ${allCategoryNames.length}`);
        console.log("=== GET ALL CATEGORY NAMES END ===");
        return allCategoryNames;
    }
}