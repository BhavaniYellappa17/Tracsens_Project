import { Page, expect } from "@playwright/test";

export class productManagement {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    // Top-level Product Management menu item in the sidebar
    lnkProductManagementMenu = "//span[text()='Product Management']";

    // Hidden file input used for uploading product images via setInputFiles
    chooseFile = '//input[@id="hidden-file-input"]';

    // Products submenu item inside the sidebar submenu list under Product Management
    lnkProductSubMenu = "//ul[contains(@class,'sidebar-submenu')]//span[text()='Products']";

    // Main page title heading on the Product Catalog listing page
    productPageTitle = "//h1[text()='Product Catalog']";

    // Button to open the Add New Product form
    productAddNewButton = "//button[text()='Add New Product']";

    // Search bar to find products by name or SKU on the listing page
    productSearchBar = "//input[@placeholder='Find products by name or SKU...']";

    // Category filter dropdown on the product listing page (contains "All Categories" option)
    productAllCategories = "//select[.//option[text()='All Categories']]";

    // Product table scroll container on the listing page
    productTable = "//div[@class='product-table-scroll']";

    // Title/heading of the Add New Product modal or page
    addProductPageTitle = "//h5[text()='Add New Product to Catalog']";

    // Product Name input field inside Add New Product form
    ProductName = "(//label[text()='Product Name']/following::input)[1]";

    // Detailed Description textarea inside Add New Product form
    detailedDescription = "//label[text()='Detailed Description']/following::textarea";

    // SKU input field inside Add New Product form
    stockKeepingUnit = "(//label[text()='Stock Keeping Unit (SKU)']/following::input)[1]";

    // Standard Price input field inside Add New Product form
    standardPrice = "(//label[text()='Standard Price (USD)']/following::input)[1]";

    // Product Category typeahead/autocomplete input inside Add New Product form
    productCategory = "(//label[text()='Product Category']/following::input)[1]";

    // Customer (Company) typeahead/autocomplete input inside Add New Product form
    customer_company = "(//label[text()='Customer (Company)']/following::input)[1]";

    // Image upload input — accepts image files only
    imageUpload = "//input[@accept='image/*']";

    // Submit button to complete and save the new product entry
    productSubmitButton = "//button[text()='Complete Entry']";

    // Edit button icon on a product row in the listing table
    productEditButton = "//img[@alt='Edit']";

    // Save button inside the Edit Product form
    editSaveButton = "//button[text()='Update Record']";

    // Delete button on a product row (soft delete — can be restored)
    DeleteButton = "//button[@title='Delete product (can be restored)']";

    // Deactivate button on a product row (sets product to inactive)
    setInactiveButton = "//button[@title='Deactivate product']";

    // "Set active" text shown after a product is deactivated — used for verification
    txt_setActive = "//span[text()='Set active']";

    // Remove confirmation button shown inside the delete confirmation dialog
    deteteRemoveButton = "//button[text()='Remove']";

    // ==================== METHODS ====================

    /**
     * @function createProductVerify
     * @author Bhavani
     * @date 2026-05-12
     * @description Creates a new product if it does not already exist in the catalog.
     * Performs the following steps:
     *  1. Clicks Product Management menu in the sidebar
     *  2. Clicks the Products submenu item
     *  3. Waits for the product table to load
     *  4. Searches for the product by name to check for duplicates
     *  5. If not found, opens the Add New Product form
     *  6. Fills product name, description, SKU, and standard price
     *  7. Selects product category and customer company from dropdowns
     *  8. Uploads a product image
     *  9. Submits the form to create the product
     *
     * @param {string} sproductName         - Product name to create or search for
     * @param {string} sdetailedDescription - Detailed description text for the product
     * @param {string} sstockKeepingUnit    - SKU value for the product
     * @param {string} sstandardPrice       - Standard price value for the product
     * @param {string} menu                 - Top-level sidebar menu (e.g., "Product Management")
     * @param {string} subMenu              - Submenu item to navigate to (e.g., "Products")
     * @returns {Promise<void>}
     * @example
     * await productManagement.createProductVerify(
     *   "Royal Stag",
     *   "Premium blended whisky",
     *   "ROYAL_STAG_750ML",
     *   "450",
     *   "Product Management",
     *   "Products"
     * );
     */
    async createProductVerify(
        sproductName: string,
        sdetailedDescription: string,
        sstockKeepingUnit: string,
        sstandardPrice: string,
        menu: string,
        subMenu: string
    ): Promise<void> {
        console.log("=== CREATE PRODUCT START ===");
        console.log(`ℹ️ Product Name     : "${sproductName}"`);
        console.log(`ℹ️ Description      : "${sdetailedDescription}"`);
        console.log(`ℹ️ SKU              : "${sstockKeepingUnit}"`);
        console.log(`ℹ️ Standard Price   : "${sstandardPrice}"`);

        // -------------------- NAVIGATION SECTION --------------------

        // Step 1: Click Product Management top-level menu in the sidebar
        console.log("Step 1: Clicking Product Management menu");
        await this.page.locator(this.lnkProductManagementMenu).click();
        await this.page.waitForTimeout(2000);
        console.log("✅ Product Management menu clicked");

        // Step 2: Click Products submenu item to navigate to product listing
        console.log("Step 2: Clicking Products submenu");
        await this.page.locator(this.lnkProductSubMenu).click();
        console.log("✅ Products submenu clicked");

        // Step 3: Wait for the product table to load before interacting
        console.log("Step 3: Waiting for product table to load");
        await this.page.locator(this.productTable).waitFor();
        console.log("✅ Product table is visible");

        // -------------------- DUPLICATE CHECK SECTION --------------------

        // Step 4: Search for the product by name to check if it already exists
        console.log(`Step 4: Searching for existing product: "${sproductName}"`);
        await this.page.locator(this.productSearchBar).fill(sproductName);
        await this.page.waitForTimeout(globalThis.giSMALLWAIT);
        console.log(`ℹ️ Wait time applied: ${globalThis.giSMALLWAIT}ms`);

        // Step 5: Count search results to determine if product already exists
        const productCount = await this.page.locator(`text=${sproductName}`).count();
        console.log(`Step 5: Product search result count: ${productCount}`);

        // -------------------- PRODUCT CREATION SECTION --------------------

        if (productCount === 0) {
            console.log(`ℹ️ Product "${sproductName}" not found — proceeding with creation`);

            // Step 6: Click Add New Product button to open the creation form
            console.log("Step 6: Clicking Add New Product button");
            await this.page.locator(this.productAddNewButton).click();
            console.log("✅ Add New Product button clicked — form should open");

            // Step 7: Wait for Product Name field to confirm form has loaded
            console.log("Step 7: Waiting for Add New Product form to load");
            await this.page.locator(this.ProductName).waitFor({ state: 'visible' });
            console.log("✅ Add New Product form is visible");

            // Step 8: Fill in the product name
            console.log(`Step 8: Filling Product Name: "${sproductName}"`);
            await this.page.locator(this.ProductName).fill(sproductName);
            console.log("✅ Product name filled");

            // Step 9: Fill in the detailed description
            console.log(`Step 9: Filling Detailed Description: "${sdetailedDescription}"`);
            await this.page.locator(this.detailedDescription).fill(sdetailedDescription);
            console.log("✅ Detailed description filled");

            // Step 10: Fill in the SKU value
            console.log(`Step 10: Filling SKU: "${sstockKeepingUnit}"`);
            await this.page.locator(this.stockKeepingUnit).fill(sstockKeepingUnit);
            console.log("✅ SKU filled");

            // Step 11: Fill in the standard price
            console.log(`Step 11: Filling Standard Price: "${sstandardPrice}"`);
            await this.page.locator(this.standardPrice).fill(sstandardPrice);
            console.log("✅ Standard price filled");

            // Step 12: Click Product Category input to open the dropdown
            console.log("Step 12: Clicking Product Category input to open dropdown");
            await this.page.locator(this.productCategory).click();
            await this.page.locator('.dropdown-menu').waitFor({ state: 'visible' });
            console.log("✅ Product Category dropdown is visible");

            // Step 13: Select BRANDY from the category dropdown
            console.log("Step 13: Selecting 'BRANDY' from category dropdown");
            await this.page.locator('.dropdown-menu').getByText('BRANDY').click();
            console.log("✅ Category 'BRANDY' selected");

            // Step 14: Click Customer Company input to open the dropdown
            console.log("Step 14: Clicking Customer Company input to open dropdown");
            await this.page.locator(this.customer_company).click();
            await this.page.locator('.dropdown-menu').waitFor({ state: 'visible' });
            console.log("✅ Customer Company dropdown is visible");

            // Step 15: Select TejasDesai from the company dropdown
            console.log("Step 15: Selecting 'TejasDesai' from company dropdown");
            await this.page.locator('.dropdown-menu').getByText('TejasDesai').click();
            console.log("✅ Company 'TejasDesai' selected");

            // Step 16: Upload product image using file path
            console.log("Step 16: Uploading product image from local path");
            await this.page.locator(this.chooseFile).setInputFiles('C:/Users/bhavani/Downloads/LCIN05218.png');
            console.log("✅ Product image uploaded");

            // Step 17: Wait for Submit button to be ready before clicking
            console.log("Step 17: Waiting for Submit button to be visible");
            await this.page.locator(this.productSubmitButton).waitFor({ state: 'visible' });
            console.log("✅ Submit button is visible");

            // Step 18: Click Submit to complete the product creation
            console.log("Step 18: Clicking Submit button to complete product creation");
            await this.page.locator(this.productSubmitButton).click();
            console.log(`✅ Product creation submitted`);
            console.log(`✅ CREATE PRODUCT SUCCESS: "${sproductName}" created successfully`);

        } else {
            // Product already exists — skip creation to avoid duplicates
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
     * Performs the following steps:
     *  1. Searches for the product by current name
     *  2. Filters by BRANDY category to narrow results
     *  3. Clicks the Edit button and updates name and price
     *  4. Saves changes and verifies the updated name appears in the table
     *  5. Searches for the updated product and clicks Deactivate
     *  6. Verifies deactivation was successful
     *  7. Clicks Delete and confirms via the Remove button
     *  8. Verifies the product no longer appears in the table
     *
     * @param {string} editProdName   - New product name to set during edit
     * @param {string} sproductName   - Current product name to search for
     * @param {string} sstandardPrice - New standard price to set during edit
     * @returns {Promise<void>}
     * @example
     * await productManagement.editDeleteProduct(
     *   "Royal Stag Updated",
     *   "Royal Stag",
     *   "500"
     * );
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

        // -------------------- EDIT SECTION --------------------

        // Step 1: Clear search bar before entering new search term
        console.log("Step 1: Clearing product search bar");
        await this.page.locator(this.productSearchBar).clear();
        console.log("✅ Search bar cleared");

        // Step 2: Search for the product by its current name
        console.log(`Step 2: Searching for product: "${sproductName}"`);
        await this.page.locator(this.productSearchBar).fill(sproductName);
        console.log("✅ Product name entered in search bar");

        // Step 3: Wait for the category filter dropdown to be visible
        console.log("Step 3: Waiting for category filter dropdown to be visible");
        await this.page.locator(this.productAllCategories).waitFor({ state: 'visible' });
        console.log("✅ Category filter dropdown is visible");

        // Step 4: Select BRANDY category to filter and narrow search results
        console.log("Step 4: Selecting 'BRANDY' from category filter dropdown");
        await this.page.locator(this.productAllCategories).selectOption({ label: 'BRANDY' });
        await this.page.waitForTimeout(2000);
        console.log("✅ Category filter set to 'BRANDY'");

        // Step 5: Count how many matching products are visible after filter
        const editCount = await this.page.locator(`text=${sproductName}`).count();
        console.log(`Step 5: Product "${sproductName}" found count after filter: ${editCount}`);

        // Step 6: Wait for the Edit Product button to appear on the first matching row
        console.log("Step 6: Waiting for Edit Product button to be visible");
        await this.page.locator('[title="Edit Product"]').first().waitFor({ state: 'visible' });
        console.log("✅ Edit Product button is visible");

        // Step 7: Click the Edit Product button to open the edit form
        console.log("Step 7: Clicking Edit Product button");
        await this.page.locator('[title="Edit Product"]').first().click();
        console.log("✅ Edit Product button clicked — edit form should open");

        // Step 8: Wait for the product name input to confirm edit form has loaded
        console.log("Step 8: Waiting for edit form product name field to be visible");
        await this.page.locator('[placeholder="Enter product name"]').waitFor({ state: 'visible' });
        console.log("✅ Edit form is visible");

        // Step 9: Fill in the new product name
        console.log(`Step 9: Filling new product name: "${editProdName}"`);
        await this.page.locator('[placeholder="Enter product name"]').fill(editProdName);
        console.log("✅ New product name filled");

        // Step 10: Fill in the updated standard price
        console.log(`Step 10: Filling updated standard price: "${sstandardPrice}"`);
        await this.page.locator(this.standardPrice).fill(sstandardPrice);
        console.log("✅ Updated standard price filled");

        // Step 11: Click Save/Update button to save the edited product
        console.log("Step 11: Clicking Update Record button to save changes");
        await this.page.locator(this.editSaveButton).click();
        console.log("✅ Update Record button clicked");

        // Step 12: Wait for the page to refresh and reflect the updated product
        console.log("Step 12: Waiting 3 seconds for page to update after save");
        await this.page.waitForTimeout(3000);
        console.log("✅ Wait complete");

        // Step 13: Search for the updated product name to verify edit was saved
        console.log(`Step 13: Searching for updated product name: "${editProdName}"`);
        await this.page.locator(this.productSearchBar).clear();
        await this.page.locator(this.productSearchBar).fill(editProdName);
        console.log("✅ Updated product name entered in search bar");

        // Step 14: Assert the updated product name is visible in the table
        console.log(`Step 14: Verifying updated product "${editProdName}" is visible in table`);
        await expect(this.page.locator(`//span[text()='${editProdName}']`).first()).toBeVisible();
        console.log(`✅ EDIT SUCCESS: Product "${editProdName}" edited and verified successfully`);

        // -------------------- DELETE SECTION --------------------

        console.log("\n=== DELETE PRODUCT START ===");
        console.log(`ℹ️ Product to delete: "${editProdName}"`);

        // Step 15: Search for the edited product to prepare for deletion
        console.log(`Step 15: Searching for product to delete: "${editProdName}"`);
        await this.page.locator(this.productSearchBar).waitFor();
        await this.page.locator(this.productSearchBar).clear();
        await this.page.locator(this.productSearchBar).fill(editProdName);
        await this.page.waitForTimeout(2000);
        console.log("✅ Product found in search results — ready for deletion");

        // Step 16: Click Deactivate button to set product to inactive before deleting
        console.log("Step 16: Clicking Deactivate button to set product inactive");
        await this.page.locator(this.setInactiveButton).click();
        console.log("✅ Deactivate button clicked");

        // Verify deactivation was successful by checking for "Set active" text
        if (await this.page.locator(this.txt_setActive).isVisible()) {
            console.log("✅ Product deactivated successfully — 'Set active' text is visible");
        } else {
            console.log("❌ Product deactivation failed — 'Set active' text not visible");
        }

        // Step 17: Register dialog handler BEFORE clicking Delete to catch confirmation alert
        console.log("Step 17: Registering dialog handler to accept delete confirmation alert");
        this.page.once('dialog', async dialog => {
            console.log(`ℹ️ Dialog message: "${dialog.message()}"`);
            await dialog.accept();
            console.log("✅ Delete confirmation alert accepted");
        });

        // Step 18: Click Delete button to trigger confirmation flow
        console.log("Step 18: Clicking Delete button");
        await this.page.locator(this.DeleteButton).click();
        console.log("✅ Delete button clicked");

        // Step 19: Wait for and click the Remove confirmation button
        console.log("Step 19: Waiting for Remove confirmation button");
        await this.page.locator(this.deteteRemoveButton).waitFor();
        console.log("✅ Remove button is visible");
        await this.page.locator(this.deteteRemoveButton).click();
        console.log("✅ Remove confirmation button clicked");

        // Step 20: Wait for deletion to process
        console.log("Step 20: Waiting 3 seconds for deletion to process");
        await this.page.waitForTimeout(3000);
        console.log("✅ Wait complete");

        // Step 21: Verify product is no longer visible in the table
        console.log(`Step 21: Verifying product "${editProdName}" is removed from table`);
        const remainingCount = await this.page.locator(`//span[text()='${editProdName}']`).count();
        console.log(`ℹ️ Remaining product count after deletion: ${remainingCount}`);

        if (remainingCount === 0) {
            console.log(`✅ DELETE SUCCESS: Product "${editProdName}" deleted successfully`);
        } else {
            console.log(`❌ DELETE FAILED: Product "${editProdName}" still visible in table`);
        }

        console.log("=== DELETE PRODUCT END ===");
    }

    /**
     * @function createEditDeleteProduct
     * @author Bhavani
     * @date 2026-05-12
     * @description Master method that runs the complete product lifecycle flow in one call:
     *  1. Creates a new product if it does not already exist
     *  2. Edits the product name and price and verifies the update
     *  3. Deactivates the product
     *  4. Deletes the product and verifies deletion
     *
     * @param {string} sproductName         - Product name to create
     * @param {string} sdetailedDescription - Detailed description for the product
     * @param {string} sstockKeepingUnit    - SKU value for the product
     * @param {string} sstandardPrice       - Standard price for the product
     * @param {string} editProdName         - New name to set for the product during edit
     * @param {string} menu                 - Top-level sidebar menu (e.g., "Product Management")
     * @param {string} subMenu              - Submenu item to navigate to (e.g., "Products")
     * @returns {Promise<void>}
     * @example
     * await productManagement.createEditDeleteProduct(
     *   "Royal Stag",
     *   "Premium blended whisky",
     *   "ROYAL_STAG_750ML",
     *   "450",
     *   "Royal Stag Updated",
     *   "Product Management",
     *   "Products"
     * );
     */
    async createEditDeleteProduct(
        sproductName: string,
        sdetailedDescription: string,
        sstockKeepingUnit: string,
        sstandardPrice: string,
        editProdName: string,
        menu: string,
        subMenu: string
    ): Promise<void> {
        console.log("=== CREATE EDIT DELETE PRODUCT FLOW START ===");
        console.log(`ℹ️ Product Name   : "${sproductName}"`);
        console.log(`ℹ️ Edit Name      : "${editProdName}"`);
        console.log(`ℹ️ SKU            : "${sstockKeepingUnit}"`);
        console.log(`ℹ️ Price          : "${sstandardPrice}"`);
        console.log(`ℹ️ Menu           : "${menu}" > "${subMenu}"`);

        // Step 1: Create the product and verify it was added successfully
        console.log("\nStep 1: Starting product creation");
        await this.createProductVerify(
            sproductName,
            sdetailedDescription,
            sstockKeepingUnit,
            sstandardPrice,
            menu,
            subMenu
        );
        console.log("✅ Product creation step complete");

        // Step 2: Edit the product name and price, then delete it
        console.log("\nStep 2: Starting product edit and deletion");
        await this.editDeleteProduct(editProdName, sproductName, sstandardPrice);
        console.log("✅ Product edit and deletion step complete");

        console.log("\n=== CREATE EDIT DELETE PRODUCT FLOW END ===");
    }
}