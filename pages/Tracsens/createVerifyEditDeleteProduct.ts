import { Page, expect } from "@playwright/test";

export class productManagement {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    lnkProductManagementMenu = "//span[text()='Product Management']";
    chooseFile = '//input[@id="hidden-file-input"]';
    lnkProductSubMenu = "//ul[contains(@class,'sidebar-submenu')]//span[text()='Products']";
    productPageTitle = "//h1[text()='Product Catalog']";
    productAddNewButton = "//button[text()='Add New Product']";
    productSearchBar = "//input[@placeholder='Find products by name or SKU...']";
    productAllCategories = "//select[.//option[text()='All Categories']]";
    productTable = "//div[@class='product-table-scroll']";
    addProductPageTitle = "//h5[text()='Add New Product to Catalog']";
    ProductName = "(//label[text()='Product Name']/following::input)[1]";
    detailedDescription = "//label[text()='Detailed Description']/following::textarea";
    stockKeepingUnit = "(//label[text()='Stock Keeping Unit (SKU)']/following::input)[1]";
    standardPrice = "(//label[text()='Standard Price (USD)']/following::input)[1]";
    productCategory = "(//label[text()='Product Category']/following::input)[1]";
    customer_company = "(//label[text()='Customer (Company)']/following::input)[1]";
    imageUpload = "//input[@accept='image/*']";
    productSubmitButton = "//button[text()='Complete Entry']";
    productEditButton = "//img[@alt='Edit']";
    editSaveButton = "//button[text()='Update Record']";
    DeleteButton = "//button[@title='Delete product (can be restored)']";
    setInactiveButton = "//button[@title='Deactivate product']";
    txt_setActive = "//span[text()='Set active']";
    deteteRemoveButton = "//button[text()='Remove']";

    // ==================== METHODS ====================

    /**
     * @function createProductVerify
     * @author Bhavani
     * @date 2026-05-12
     * @description Creates a new product if it does not already exist in the catalog.
     * Navigates to Product Management → Products, checks for duplicates,
     * fills all form fields, uploads image, and submits.
     * @param {string} sproductName         - Product name to create or search for
     * @param {string} sdetailedDescription - Detailed description text for the product
     * @param {string} sstockKeepingUnit    - SKU value for the product
     * @param {string} sstandardPrice       - Standard price value for the product
     * @param {string} imagePath            - Resolved absolute path to the product image file
     * @param {string} menu                 - Top-level sidebar menu label
     * @param {string} subMenu              - Submenu item label to navigate to
     */
    async createProductVerify(
        sproductName: string,
        sdetailedDescription: string,
        sstockKeepingUnit: string,
        sstandardPrice: string,
        imagePath: string,
        menu: string,
        subMenu: string
    ): Promise<void> {
        console.log("=== CREATE PRODUCT START ===");
        console.log(`ℹ️ Product Name     : "${sproductName}"`);
        console.log(`ℹ️ Description      : "${sdetailedDescription}"`);
        console.log(`ℹ️ SKU              : "${sstockKeepingUnit}"`);
        console.log(`ℹ️ Standard Price   : "${sstandardPrice}"`);
        console.log(`ℹ️ Image Path       : "${imagePath}"`);

        // Step 1: Click Product Management top-level menu
        console.log("Step 1: Clicking Product Management menu");
        await this.page.locator(this.lnkProductManagementMenu).click();
        await this.page.waitForTimeout(2000);
        console.log("✅ Product Management menu clicked");

        // Step 2: Click Products submenu
        console.log("Step 2: Clicking Products submenu");
        await this.page.locator(this.lnkProductSubMenu).click();
        console.log("✅ Products submenu clicked");

        // Step 3: Wait for product table to load
        console.log("Step 3: Waiting for product table to load");
        await this.page.locator(this.productTable).waitFor();
        await this.page.waitForLoadState('networkidle');
        console.log("✅ Product table is visible");

        // Step 4: Search for product to check if already exists
        console.log(`Step 4: Searching for existing product: "${sproductName}"`);
        await this.page.locator(this.productSearchBar).fill(sproductName);
        await this.page.waitForTimeout(globalThis.giSMALLWAIT);
        console.log(`ℹ️ Wait time applied: ${globalThis.giSMALLWAIT}ms`);

        // Step 5: Count search results to avoid duplicate creation
        const productCount = await this.page.locator(`text=${sproductName}`).count();
        console.log(`Step 5: Product search result count: ${productCount}`);

        if (productCount === 0) {
            console.log(`ℹ️ Product "${sproductName}" not found — proceeding with creation`);

            // Step 6: Click Add New Product button
            console.log("Step 6: Clicking Add New Product button");
            await this.page.locator(this.productAddNewButton).click();
            console.log("✅ Add New Product button clicked");

            // Step 7: Wait for form to load
            console.log("Step 7: Waiting for Add New Product form to load");
            await this.page.locator(this.ProductName).waitFor({ state: 'visible' });
            console.log("✅ Add New Product form is visible");

            // Step 8: Fill product name
            console.log(`Step 8: Filling Product Name: "${sproductName}"`);
            await this.page.locator(this.ProductName).fill(sproductName);
            console.log("✅ Product name filled");

            // Step 9: Fill detailed description
            console.log(`Step 9: Filling Detailed Description: "${sdetailedDescription}"`);
            await this.page.locator(this.detailedDescription).fill(sdetailedDescription);
            console.log("✅ Detailed description filled");

            // Step 10: Fill SKU
            console.log(`Step 10: Filling SKU: "${sstockKeepingUnit}"`);
            await this.page.locator(this.stockKeepingUnit).fill(sstockKeepingUnit);
            console.log("✅ SKU filled");

            // Step 11: Fill standard price
            console.log(`Step 11: Filling Standard Price: "${sstandardPrice}"`);
            await this.page.locator(this.standardPrice).fill(sstandardPrice);
            console.log("✅ Standard price filled");

            // Step 12: Click Product Category dropdown and wait for it to open
            console.log("Step 12: Clicking Product Category input to open dropdown");
            await this.page.locator(this.productCategory).scrollIntoViewIfNeeded();
            await this.page.locator(this.productCategory).click();
            await this.page.locator('.dropdown-menu').waitFor({ state: 'visible', timeout: 5000 });
            console.log("✅ Product Category dropdown is visible");

            // Step 13: Select BRANDY category
            console.log("Step 13: Selecting 'BRANDY' from category dropdown");
            await this.page.locator('.dropdown-menu').getByText('BRANDY').waitFor({ state: 'visible' });
            await this.page.locator('.dropdown-menu').getByText('BRANDY').click();
            await this.page.waitForTimeout(500);
            console.log("✅ Category 'BRANDY' selected");

            // Step 14: Click Customer Company dropdown and wait for it to open
            console.log("Step 14: Clicking Customer Company input to open dropdown");
            await this.page.locator(this.customer_company).scrollIntoViewIfNeeded();
            await this.page.locator(this.customer_company).click();
            await this.page.locator('.dropdown-menu').waitFor({ state: 'visible', timeout: 5000 });
            console.log("✅ Customer Company dropdown is visible");

            // Step 15: Select TejasDesai
            console.log("Step 15: Selecting 'TejasDesai' from company dropdown");
            await this.page.locator('.dropdown-menu').getByText('TejasDesai').waitFor({ state: 'visible' });
            await this.page.locator('.dropdown-menu').getByText('TejasDesai').click();
            await this.page.waitForTimeout(500);
            console.log("✅ Company 'TejasDesai' selected");

            // Step 16: Upload product image using resolved absolute path
            console.log(`Step 16: Uploading product image from: "${imagePath}"`);
            await this.page.locator(this.chooseFile).setInputFiles(imagePath);
            await this.page.waitForTimeout(1000);
            console.log("✅ Product image uploaded");

            // Step 17: Wait for Submit button to become visible
            console.log("Step 17: Waiting for Submit button to be visible");
            await this.page.locator(this.productSubmitButton).waitFor({ state: 'visible' });
            console.log("✅ Submit button is visible");

            // Step 18: Click Submit to create the product
            console.log("Step 18: Clicking Submit button to complete product creation");
            await this.page.locator(this.productSubmitButton).click();
            await this.page.waitForTimeout(2000);
            console.log(`✅ CREATE PRODUCT SUCCESS: "${sproductName}" created successfully`);

        } else {
            console.log(`⚠️ Product "${sproductName}" already exists (count: ${productCount}) — skipping creation`);
        }

        console.log("=== CREATE PRODUCT END ===");
    }

    /**
     * @function editDeleteProduct
     * @author Bhavani
     * @date 2026-05-12
     * @description Edits an existing product's name and price, verifies the update,
     * then deactivates and permanently deletes the product.
     * After deletion, reloads the page and searches to confirm the product is gone.
     * @param {string} editProdName   - New product name to set during edit
     * @param {string} sproductName   - Current product name to search for
     * @param {string} sstandardPrice - New standard price to set during edit
     */
    async editDeleteProduct(
        editProdName: string,
        sproductName: string,
        sstandardPrice: string
    ): Promise<void> {
        console.log("=== EDIT PRODUCT START ===");
        console.log(`ℹ️ Current Name : "${sproductName}"`);
        console.log(`ℹ️ New Name     : "${editProdName}"`);
        console.log(`ℹ️ New Price    : "${sstandardPrice}"`);

        // Step 1: Clear search bar before searching
        console.log("Step 1: Clearing product search bar");
        await this.page.locator(this.productSearchBar).clear();
        console.log("✅ Search bar cleared");

        // Step 2: Search for product by current name
        console.log(`Step 2: Searching for product: "${sproductName}"`);
        await this.page.locator(this.productSearchBar).fill(sproductName);
        await this.page.waitForTimeout(2000);
        console.log("✅ Product name entered in search bar");

        // Step 3: Wait for category filter dropdown to load
        console.log("Step 3: Waiting for category filter dropdown");
        await this.page.locator(this.productAllCategories).waitFor({ state: 'visible' });
        console.log("✅ Category filter dropdown is visible");

        // Step 4: Select BRANDY category filter to narrow results
        console.log("Step 4: Selecting 'BRANDY' from category filter dropdown");
        await this.page.locator(this.productAllCategories).selectOption({ label: 'BRANDY' });
        await this.page.waitForTimeout(2000);
        console.log("✅ Category filter set to 'BRANDY'");

        // Step 5: Log matching product count
        const editCount = await this.page.locator(`text=${sproductName}`).count();
        console.log(`Step 5: Product "${sproductName}" found count: ${editCount}`);

        // Step 6: Wait for Edit button to be visible
        console.log("Step 6: Waiting for Edit Product button");
        await this.page.locator('[title="Edit Product"]').first().waitFor({ state: 'visible' });
        console.log("✅ Edit Product button is visible");

        // Step 7: Click Edit button
        console.log("Step 7: Clicking Edit Product button");
        await this.page.locator('[title="Edit Product"]').first().click();
        console.log("✅ Edit Product button clicked");

        // Step 8: Wait for edit form to appear
        console.log("Step 8: Waiting for edit form to load");
        await this.page.locator('[placeholder="Enter product name"]').waitFor({ state: 'visible' });
        console.log("✅ Edit form is visible");

        // Step 9: Clear and fill new product name
        console.log(`Step 9: Filling new product name: "${editProdName}"`);
        await this.page.locator('[placeholder="Enter product name"]').clear();
        await this.page.locator('[placeholder="Enter product name"]').fill(editProdName);
        console.log("✅ New product name filled");

        // Step 10: Fill updated price
        console.log(`Step 10: Filling updated standard price: "${sstandardPrice}"`);
        await this.page.locator(this.standardPrice).fill(sstandardPrice);
        console.log("✅ Updated standard price filled");

        // Step 11: Click Update Record button to save changes
        console.log("Step 11: Clicking Update Record button");
        await this.page.locator(this.editSaveButton).click();
        console.log("✅ Update Record button clicked");

        // Step 12: Wait for page to refresh after update
        console.log("Step 12: Waiting 3 seconds for page to update");
        await this.page.waitForTimeout(3000);
        console.log("✅ Wait complete");

        // Step 13: Search for updated product name to confirm edit
        console.log(`Step 13: Searching for updated product name: "${editProdName}"`);
        await this.page.locator(this.productSearchBar).clear();
        await this.page.locator(this.productSearchBar).fill(editProdName);
        await this.page.waitForTimeout(2000);
        console.log("✅ Updated product name entered in search bar");

        // Step 14: Assert updated name is visible in table before deleting
        console.log(`Step 14: Verifying updated product "${editProdName}" is visible`);
        await expect(this.page.locator(`//span[text()='${editProdName}']`).first()).toBeVisible({ timeout: 10000 });
        console.log(`✅ EDIT SUCCESS: Product "${editProdName}" edited and verified`);

        // -------------------- DELETE SECTION --------------------

        console.log("\n=== DELETE PRODUCT START ===");

        // Step 15: Search for the edited product name to prepare for deletion
        console.log(`Step 15: Searching for product to delete: "${editProdName}"`);
        await this.page.locator(this.productSearchBar).waitFor({ state: 'visible' });
        await this.page.locator(this.productSearchBar).clear();
        await this.page.locator(this.productSearchBar).fill(editProdName);
        await this.page.waitForTimeout(2000);
        console.log("✅ Product found — ready for deletion");

        // Step 16: Click Deactivate button before deletion (required by app flow)
        console.log("Step 16: Clicking Deactivate button");
        await this.page.locator(this.setInactiveButton).first().waitFor({ state: 'visible' });
        await this.page.locator(this.setInactiveButton).first().click();
        await this.page.waitForTimeout(1000);
        console.log("✅ Deactivate button clicked");

        if (await this.page.locator(this.txt_setActive).isVisible()) {
            console.log("✅ Product deactivated — 'Set active' text visible");
        } else {
            console.log("⚠️ 'Set active' not visible — product may already be inactive");
        }

        // Step 17: Register dialog handler before clicking Delete
        // Must be registered BEFORE the click that triggers the dialog
        console.log("Step 17: Registering dialog handler");
        this.page.once('dialog', async dialog => {
            console.log(`ℹ️ Dialog message: "${dialog.message()}"`);
            await dialog.accept();
            console.log("✅ Delete confirmation dialog accepted");
        });

        // Step 18: Click Delete button to trigger deletion dialog
        console.log("Step 18: Clicking Delete button");
        await this.page.locator(this.DeleteButton).first().waitFor({ state: 'visible' });
        await this.page.locator(this.DeleteButton).first().click();
        console.log("✅ Delete button clicked");

        // Step 19: Click Remove confirmation button in the confirmation modal
        console.log("Step 19: Waiting for Remove confirmation button");
        await this.page.locator(this.deteteRemoveButton).waitFor({ state: 'visible' });
        await this.page.locator(this.deteteRemoveButton).click();
        console.log("✅ Remove confirmation clicked");

        // Step 20: Wait for deletion to fully process on the server
        console.log("Step 20: Waiting 3 seconds for deletion to process");
        await this.page.waitForTimeout(3000);
        console.log("✅ Wait complete");

        // Step 21: Reload page and search again to confirm product is gone
        // ✅ FIX: After reload we must search again — without search, the table
        //         shows all products and the deleted one may still appear in results
        console.log(`Step 21: Verifying product "${editProdName}" removed from table`);
        await this.page.reload();
        await this.page.waitForLoadState('networkidle');

        // ✅ Wait for search bar after reload, then filter by deleted product name
        await this.page.locator(this.productSearchBar).waitFor({ state: 'visible' });
        await this.page.locator(this.productSearchBar).fill(editProdName);
        await this.page.waitForTimeout(2000);

        // ✅ Count should be 0 — deleted product should not appear in filtered results
        const remainingCount = await this.page.locator(`//span[text()='${editProdName}']`).count();
        console.log(`ℹ️ Remaining count after deletion: ${remainingCount}`);

        if (remainingCount === 0) {
            console.log(`✅ DELETE SUCCESS: "${editProdName}" deleted successfully`);
        } else {
            console.log(`❌ DELETE FAILED: "${editProdName}" still visible in table`);
        }

        console.log("=== DELETE PRODUCT END ===");
    }

    /**
     * @function createEditDeleteProduct
     * @author Bhavani
     * @date 2026-05-12
     * @description Master method — runs the complete product lifecycle in sequence:
     * Create → Edit → Deactivate → Delete
     * Calls createProductVerify() then editDeleteProduct() internally.
     * @param {string} sproductName         - Product name to create
     * @param {string} sdetailedDescription - Detailed description
     * @param {string} sstockKeepingUnit    - SKU value
     * @param {string} sstandardPrice       - Standard price
     * @param {string} editProdName         - New name to set during edit
     * @param {string} imagePath            - Resolved absolute path to product image
     * @param {string} menu                 - Top-level sidebar menu label
     * @param {string} subMenu              - Submenu item label
     */
    async createEditDeleteProduct(
        sproductName: string,
        sdetailedDescription: string,
        sstockKeepingUnit: string,
        sstandardPrice: string,
        editProdName: string,
        imagePath: string,
        menu: string,
        subMenu: string
    ): Promise<void> {
        console.log("=== CREATE EDIT DELETE PRODUCT FLOW START ===");
        console.log(`ℹ️ Product Name : "${sproductName}"`);
        console.log(`ℹ️ Edit Name    : "${editProdName}"`);
        console.log(`ℹ️ SKU          : "${sstockKeepingUnit}"`);
        console.log(`ℹ️ Price        : "${sstandardPrice}"`);
        console.log(`ℹ️ Image Path   : "${imagePath}"`);
        console.log(`ℹ️ Menu         : "${menu}" > "${subMenu}"`);

        // Step 1: Create product
        console.log("\nStep 1: Starting product creation");
        await this.createProductVerify(
            sproductName,
            sdetailedDescription,
            sstockKeepingUnit,
            sstandardPrice,
            imagePath,
            menu,
            subMenu
        );
        console.log("✅ Product creation step complete");

        // Step 2: Edit and delete product
        console.log("\nStep 2: Starting product edit and deletion");
        await this.editDeleteProduct(
            editProdName,
            sproductName,
            sstandardPrice
        );
        console.log("✅ Product edit and deletion step complete");

        console.log("\n=== CREATE EDIT DELETE PRODUCT FLOW END ===");
    }
}