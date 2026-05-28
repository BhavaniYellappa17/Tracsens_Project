import { Page, expect } from "@playwright/test";

export class productManagement {

    constructor(public page: Page) {
        this.page = page;
    }

    // Locators
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


    async createProductVerify(sproductName: string, sdetailedDescription: string, sstockKeepingUnit: string, sstandardPrice: string, menu: string, subMenu: string) {
        
        console.log("=== CREATE PRODUCT START ===");
        console.log(`Product Name: ${sproductName}`);

        console.log("Step 1: Clicking Product Management menu");
        await this.page.locator(this.lnkProductManagementMenu).click();
        await this.page.waitForTimeout(2000);

        console.log("Step 2: Clicking Products submenu");
        await this.page.locator(this.lnkProductSubMenu).click();

        console.log("Step 3: Waiting for product table");
        await this.page.locator(this.productTable).waitFor();

        console.log(`Step 4: Searching for product: ${sproductName}`);
        await this.page.locator(this.productSearchBar).fill(sproductName);
        await this.page.waitForTimeout(globalThis.giSMALLWAIT);
        console.log(`Wait timeout: ${globalThis.giSMALLWAIT}`);

        const UserCount = await this.page.locator(`text=${sproductName}`).count();
        console.log(`Step 5: Product count found = ${UserCount}`);

        if (UserCount === 0) {
            console.log("Step 6: Product not found, clicking Add New Product");
            await this.page.locator(this.productAddNewButton).click();

            console.log("Step 7: Waiting for product form to load");
            await this.page.locator(this.ProductName).waitFor({ state: 'visible' });

            console.log("Step 8: Filling Product Name");
            await this.page.locator(this.ProductName).fill(sproductName);

            console.log("Step 9: Filling Detailed Description");
            await this.page.locator(this.detailedDescription).fill(sdetailedDescription);

            console.log("Step 10: Filling SKU");
            await this.page.locator(this.stockKeepingUnit).fill(sstockKeepingUnit);

            console.log("Step 11: Filling Standard Price");
            await this.page.locator(this.standardPrice).fill(sstandardPrice);

            console.log("Step 12: Clicking Product Category dropdown");
            await this.page.locator(this.productCategory).click();
            await this.page.locator('.dropdown-menu').waitFor({ state: 'visible' });
            console.log("Step 13: Selecting BRANDY from category dropdown");
            await this.page.locator('.dropdown-menu').getByText('BRANDY').click();

            console.log("Step 14: Clicking Customer Company dropdown");
            await this.page.locator(this.customer_company).click();
            await this.page.locator('.dropdown-menu').waitFor({ state: 'visible' });
            console.log("Step 15: Selecting TejasDesai from company dropdown");
            await this.page.locator('.dropdown-menu').getByText('TejasDesai').click();

            console.log("Step 16: Uploading product image");
            await this.page.locator(this.chooseFile).setInputFiles('C:/Users/bhavani/Downloads/LCIN05218.png');

            console.log("Step 17: Waiting for submit button");
            await this.page.locator(this.productSubmitButton).waitFor({ state: 'visible' });

            console.log("Step 18: Clicking Submit button");
            await this.page.locator(this.productSubmitButton).click();

            console.log(`✅ CREATE PRODUCT SUCCESS: "${sproductName}"`);
        } else {
            console.log(`⚠️ Product "${sproductName}" already exists, skipping creation`);
        }
    }


    async editDeleteProduct(editProdName: string, sproductName: string, sstandardPrice: string) {

        console.log("=== EDIT PRODUCT START ===");
        console.log(`Searching for: ${sproductName} | Will rename to: ${editProdName}`);

        console.log("Step 1: Clearing search bar");
        await this.page.locator(this.productSearchBar).clear();

        console.log(`Step 2: Filling search bar with: ${sproductName}`);
        await this.page.locator(this.productSearchBar).fill(sproductName);

        console.log("Step 3: Waiting for category dropdown");
        await this.page.locator(this.productAllCategories).waitFor({ state: 'visible' });

        console.log("Step 4: Selecting BRANDY from category filter");
        await this.page.locator(this.productAllCategories).selectOption({ label: 'BRANDY' });
        await this.page.waitForTimeout(2000);

        const editCount = await this.page.locator(`text=${sproductName}`).count();
        console.log(`Step 5: Product "${sproductName}" found count = ${editCount}`);

        console.log("Step 6: Waiting for Edit Product button");
        await this.page.locator('[title="Edit Product"]').first().waitFor({ state: 'visible' });

        console.log("Step 7: Clicking Edit Product button");
        await this.page.locator('[title="Edit Product"]').first().click();

        console.log("Step 8: Waiting for edit form to load");
        await this.page.locator('[placeholder="Enter product name"]').waitFor({ state: 'visible' });

        console.log(`Step 9: Filling new product name: ${editProdName}`);
        await this.page.locator('[placeholder="Enter product name"]').fill(editProdName);

        console.log("Step 10: Filling standard price");
        await this.page.locator(this.standardPrice).fill(sstandardPrice);

        console.log("Step 11: Clicking Save button");
        await this.page.locator(this.editSaveButton).click();

        console.log("Step 12: Waiting for page to update after save");
        await this.page.waitForTimeout(3000);

        console.log(`Step 13: Searching for edited product: ${editProdName}`);
        await this.page.locator(this.productSearchBar).clear();
        await this.page.locator(this.productSearchBar).fill(editProdName);

        console.log("Step 14: Verifying edited product is visible");
        await expect(this.page.locator(`//span[text()='${editProdName}']`).first()).toBeVisible();
        console.log(`✅ EDIT SUCCESS: "${editProdName}" edited successfully`);

        // Delete flow
        console.log("=== DELETE PRODUCT START ===");

        console.log(`Step 15: Searching for product to delete: ${editProdName}`);
        await this.page.locator(this.productSearchBar).waitFor();
        await this.page.locator(this.productSearchBar).clear();
        await this.page.locator(this.productSearchBar).fill(editProdName);
        await this.page.waitForTimeout(2000);

        console.log("Step 16: Clicking Deactivate button");
        await this.page.locator(this.setInactiveButton).click();
        if (await this.page.locator(this.txt_setActive).isVisible()) {
            console.log("✅ Successfully deactivated");
        } else {
            console.log("❌ Failed to deactivate");
        }

        console.log("Step 17: Setting up dialog handler");
        this.page.once('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
            console.log("✅ Alert accepted successfully");
        });

        console.log("Step 18: Clicking Delete button");
        await this.page.locator(this.DeleteButton).click();
        await this.page.locator(this.deteteRemoveButton).waitFor();
        await this.page.locator(this.deteteRemoveButton).click()

        await this.page.waitForTimeout(3000);

        const remainingCount = await this.page.locator(`//span[text()='${editProdName}']`).count();
        console.log(`Step 19: Remaining product count after delete = ${remainingCount}`);

        if (remainingCount === 0) {
            console.log(`✅ DELETE SUCCESS: "${editProdName}" deleted successfully`);
        } else {
            console.log(`❌ DELETE FAILED: "${editProdName}" still exists`);
        }
    }


    async createEditDeleteProduct(sproductName: string, sdetailedDescription: string, sstockKeepingUnit: string, sstandardPrice: string, editProdName: string, menu: string, subMenu: string) {
        console.log("=== createEditDeleteProduct START ===");
        await this.createProductVerify(sproductName, sdetailedDescription, sstockKeepingUnit, sstandardPrice, menu, subMenu);
        await this.editDeleteProduct(editProdName, sproductName, sstandardPrice);
        console.log("=== createEditDeleteProduct END ===");
    }
}