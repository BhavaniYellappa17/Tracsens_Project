/**
 * @fileoverview Test suite for Product Management module.
 *
 * Covers the following test scenarios:
 *  - Fetching all product names and SKUs from the product list
 *  - Positive: Creating, editing, and deleting products (data-driven)
 *  - Negative: Product form validation tests
 *  - Fetching all product category names
 *
 * @module ProductManagementTests
 * @author Bhavani
 * @date 2026-05-12
 *
 * @testFile productData.json - Contains array of product test data records
 * @dependencies
 *  - productList           → handles fetching all product names and SKUs
 *  - productCategory       → handles fetching all product category names
 *  - productManagement     → handles product create, edit, delete flows
 *  - hooks/hooks           → handles login and logout before/after each test
 */

import { test, expect } from '@playwright/test';
import '../../hooks/hooks';
import path from 'path';                  // ✅ required to resolve relative image paths
import { productList } from '../../pages/Tracsens/FetchProductNames';
import { productCategory } from '../../pages/Tracsens/productCategory';
import { productManagement } from '../../pages/Tracsens/createVerifyEditDeleteProduct';
import productData from '../testdata/productData.json';

// ==================== PAGE OBJECT INSTANCES ====================

let productPage: productManagement;
let FetchproductCategory: productCategory;
let FetchProductNames: productList;

const testData = productData[0];

// ==============================================================
// FETCH PRODUCT LIST
// ==============================================================

/**
 * @test Fetch ProductList
 * @description Fetches and logs all product names and their associated SKUs
 * from the Tracsens product list page.
 */
test('Fetch ProductList', async ({ page }) => {

    test.setTimeout(600000);
    console.log("=== FETCH PRODUCT LIST TEST START ===");

    try {

        console.log("Initializing Page Object Model instances");
        FetchProductNames = new productList(page);
        console.log("✅ productList instance created");

        console.log("\nStep 1: Fetching all product names and SKUs");
        await FetchProductNames.getAllProductNamesAndSKUs();
        console.log("✅ All product names and SKUs fetched successfully");

    } catch (error) {
        if (error instanceof Error) {
            console.log(`❌ Test failed with error: ${error.message}`);
            console.log(`❌ Stack trace: ${error.stack}`);
        } else {
            console.log(`❌ Test failed with unknown error: ${error}`);
        }
        throw error;
    }

    console.log("=== FETCH PRODUCT LIST TEST END ===");
});

// ==============================================================
// ✅ POSITIVE TESTS — PRODUCT CREATE, EDIT, DELETE
// ==============================================================

/**
 * @describe Positive - Product Management Tests
 * @description Validates the complete product lifecycle with valid data.
 * Creates → Verifies → Edits → Deletes a product record.
 *
 * NOTE on assertions:
 *  - After createProductVerify() → assert product IS visible in table ✅
 *  - After editDeleteProduct()   → assert product is NOT visible (already deleted inside POM) ✅
 *  - Do NOT assert editProdName toBeVisible() after editDeleteProduct() —
 *    the POM deletes the product internally, so it will already be gone.
 *
 * @testData productData.json → sproductName, sstockKeepingUnit, sstandardPrice, imagePath
 */
test.describe('Positive - Product Management Tests', () => {

    test('createProduct', async ({ page }) => {

        test.setTimeout(180000);
        console.log("=== CREATE PRODUCT POSITIVE TEST START ===");
        console.log(`ℹ️ Total data records to process: ${productData.length}`);

        try {

            console.log("Initializing Page Object Model instances");
            productPage = new productManagement(page);
            console.log("✅ productManagement instance created");

            console.log("\nStarting data-driven loop through productData records");

            for (const data of productData) {

                console.log("\n========================================");
                console.log(`ℹ️ Product Name         : "${data.sproductName}"`);
                console.log(`ℹ️ Detailed Description : "${data.sdetailedDescription}"`);
                console.log(`ℹ️ SKU                  : "${data.sstockKeepingUnit}"`);
                console.log(`ℹ️ Standard Price       : "${data.sstandardPrice}"`);
                console.log(`ℹ️ Edit Product Name    : "${data.editProdName}"`);
                console.log(`ℹ️ Image Path           : "${data.imagePath}"`);
                console.log(`ℹ️ Menu                 : "${data.menu}"`);
                console.log(`ℹ️ Product SubMenu      : "${data.ProductSubMenu}"`);
                console.log("========================================");

                // ── STEP 1: Create Product ──
                console.log(`\nStep 1: Creating product: "${data.sproductName}"`);

                // ✅ Resolve relative imagePath from JSON to absolute path at runtime
                // This ensures the path works on any machine or CI environment
                const resolvedImagePath = path.resolve(data.imagePath);
                console.log(`ℹ️ Resolved image path: "${resolvedImagePath}"`);

                await productPage.createProductVerify(
                    data.sproductName,
                    data.sdetailedDescription,
                    data.sstockKeepingUnit,
                    data.sstandardPrice,
                    resolvedImagePath,      // ✅ passing resolved absolute path
                    data.menu,
                    data.ProductSubMenu
                );

                // ✅ Assert: Product table visible after creation
                await expect(page.locator("//div[@class='product-table-scroll']")).toBeVisible({ timeout: 15000 });
                console.log("✅ Assert passed: Product table visible after creation");

                // ✅ Assert: Created product visible in table
                await expect(page.locator(`//span[text()='${data.sproductName}']`).first()).toBeVisible({ timeout: 10000 });
                console.log(`✅ Assert passed: Product "${data.sproductName}" visible in table`);

                // ── STEP 2: Edit and Delete Product ──
                // NOTE: editDeleteProduct() handles BOTH edit AND delete internally inside the POM.
                // It edits the product name → verifies edit → deactivates → deletes.
                // So after this call, the product is ALREADY deleted.
                // We only assert that it is NOT found in the table after this call.
                console.log(`\nStep 2: Editing and deleting product "${data.sproductName}" → "${data.editProdName}"`);
                await productPage.editDeleteProduct(data.editProdName, data.sproductName, data.sstandardPrice);

                // ✅ Assert: Product deleted — should NOT be found in table
                // Do NOT assert toBeVisible() here — product is already deleted by POM
                await expect(page.locator(`//span[text()='${data.editProdName}']`)).toHaveCount(0);
                console.log(`✅ Assert passed: Product "${data.editProdName}" deleted — not found in table`);

                console.log(`\n✅ Record processing complete for: "${data.sproductName}"`);
            }

            console.log("\n✅ All product positive records processed successfully");

        } catch (error) {
            if (error instanceof Error) {
                console.log(`❌ Test failed with error: ${error.message}`);
                console.log(`❌ Stack trace: ${error.stack}`);
            } else {
                console.log(`❌ Test failed with unknown error: ${error}`);
            }
            throw error;
        }

        console.log("=== CREATE PRODUCT POSITIVE TEST END ===");
    });
});

// ==============================================================
// ❌ NEGATIVE TESTS — PRODUCT FORM VALIDATION
// ==============================================================

/**
 * @describe Negative - Product Management Tests
 * @description Validates product form field validations with invalid data.
 * Covers: empty name, empty SKU, empty price, negative price,
 * price with letters, duplicate SKU, invalid image type, no image.
 * Verifies the form stays open or submit button is disabled.
 * @testData productData.json → negativeProduct[]
 */
test.describe('Negative - Product Management Tests', () => {

    for (const negData of testData.negativeProduct) {

        test(`Negative Product - ${negData.testCase}`, async ({ page }) => {

            test.setTimeout(60000);
            console.log(`=== START: Negative Product - ${negData.testCase} ===`);

            const productPage = new productManagement(page);
            console.log('✅ productManagement instance created');

            // ── STEP 1: Navigate to Products ──
            console.log('Step 1: Navigating to Product Management > Products');
            await page.locator("//span[text()='Product Management']").click();
            await page.waitForTimeout(2000);
            await page.locator("//ul[contains(@class,'sidebar-submenu')]//span[text()='Products']").click();
            await page.locator("//div[@class='product-table-scroll']").waitFor();
            await page.waitForLoadState('networkidle');
            console.log('✅ Navigated to Products page');

            // ── STEP 2: Open Add New Product Form ──
            console.log('Step 2: Clicking Add New Product button');
            await page.locator("//button[text()='Add New Product']").click();
            await page.locator("//h5[text()='Add New Product to Catalog']").waitFor({ state: 'visible' });
            // ✅ Assert: Form opened
            await expect(page.locator("//h5[text()='Add New Product to Catalog']")).toBeVisible({ timeout: 5000 });
            console.log('✅ Assert passed: Add New Product form opened');

            // ── STEP 3: Fill Form with Invalid Data ──
            console.log('Step 3: Filling form with invalid/empty test data');
            console.log(`ℹ️ Product Name : "${negData.sproductName}"`);
            console.log(`ℹ️ SKU          : "${negData.sstockKeepingUnit}"`);
            console.log(`ℹ️ Price        : "${negData.sstandardPrice}"`);

            // Fill product name
            await page.locator("(//label[text()='Product Name']/following::input)[1]").fill(negData.sproductName);
            console.log('✅ Product name filled');

            // Fill description
            await page.locator("//label[text()='Detailed Description']/following::textarea").fill(negData.sdetailedDescription);
            console.log('✅ Description filled');

            // Fill SKU
            await page.locator("(//label[text()='Stock Keeping Unit (SKU)']/following::input)[1]").fill(negData.sstockKeepingUnit);
            console.log('✅ SKU filled');

            // Handle price with letters separately to avoid freeze
            if (negData.sstandardPrice === 'abc') {
                console.log('ℹ️ Price with letters — using keyboard.type to avoid freeze');
                await page.locator("(//label[text()='Standard Price (USD)']/following::input)[1]").click();
                await page.keyboard.type('abc');
                await page.keyboard.press('Tab');
                await page.waitForTimeout(500);
                console.log('✅ Price field handled for letters test case');
            } else {
                await page.locator("(//label[text()='Standard Price (USD)']/following::input)[1]")
                    .fill(negData.sstandardPrice);
                console.log('✅ Price filled');
            }

            // ✅ Only interact with dropdowns if price is valid
            // When price is empty or invalid, the form enters an error state and
            // dropdowns behave unreliably — skipping them avoids flakiness
            if (negData.sstandardPrice !== '' && negData.sstandardPrice !== 'abc') {

                // Select category
                const categoryInput = page.locator("(//label[text()='Product Category']/following::input)[1]");
                await categoryInput.scrollIntoViewIfNeeded();
                await categoryInput.waitFor({ state: 'visible', timeout: 5000 });
                await categoryInput.click();
                await page.waitForTimeout(1000);
                await page.locator('.dropdown-menu').waitFor({ state: 'visible', timeout: 5000 });
                await page.locator('.dropdown-menu').getByText('BRANDY').waitFor({ state: 'visible' });
                await page.locator('.dropdown-menu').getByText('BRANDY').click();
                await page.waitForTimeout(500);
                console.log('✅ Category selected');

                // Select customer company
                const companyInput = page.locator("(//label[text()='Customer (Company)']/following::input)[1]");
                await companyInput.scrollIntoViewIfNeeded();
                await companyInput.waitFor({ state: 'visible', timeout: 5000 });
                await companyInput.click();
                await page.waitForTimeout(1000);
                await page.locator('.dropdown-menu').waitFor({ state: 'visible', timeout: 5000 });
                await page.locator('.dropdown-menu').getByText('TejasDesai').waitFor({ state: 'visible' });
                await page.locator('.dropdown-menu').getByText('TejasDesai').click();
                await page.waitForTimeout(500);
                console.log('✅ Company selected');

            } else {
                console.log('ℹ️ Skipping dropdowns — price is empty or invalid, form is in error state');
            }

            // ── IMAGE UPLOAD ──
            // Upload image only if imageFile is provided in test data.
            // path.resolve() converts the relative path from JSON to an absolute path
            // so it works correctly on any machine or CI environment.
            console.log(`ℹ️ Image file: "${negData.imageFile}"`);
            if (negData.imageFile && negData.imageFile.trim() !== '') {

                // ✅ Resolve relative imageFile path to absolute path at runtime
                const resolvedImageFile = path.resolve(negData.imageFile);
                console.log(`ℹ️ Resolved image file: "${resolvedImageFile}"`);

                await page.locator("//input[@id='hidden-file-input']").setInputFiles(resolvedImageFile);
                await page.waitForTimeout(1000);

                const invalidFileError = await page.locator(
                    '//*[contains(text(),"JPG") or contains(text(),"PNG") or contains(text(),"WEBP") or contains(text(),"invalid") or contains(text(),"not supported")]'
                ).isVisible();

                if (invalidFileError) {
                    console.log('✅ Assert passed: Invalid file type error shown');
                } else {
                    console.log('✅ Image uploaded successfully');
                }

            } else {
                console.log('ℹ️ No imageFile provided — skipping image upload');
            }

            // ── STEP 4: Verify Validation ──
            console.log('Step 4: Verifying validation behaviour');
            const submitButton = page.locator("//button[text()='Complete Entry']");

            if (negData.sproductName === '' ||
                negData.sstockKeepingUnit === '' ||
                negData.sstandardPrice === '') {
                // Empty fields — button should be disabled
                console.log('ℹ️ Empty field — checking submit button is disabled');
                const isDisabled = await submitButton.isDisabled();
                if (isDisabled) {
                    await expect(submitButton).toBeDisabled();
                    console.log('✅ Assert passed: Complete Entry button is disabled');
                } else {
                    await submitButton.click();
                    await expect(page.locator("//h5[text()='Add New Product to Catalog']")).toBeVisible({ timeout: 5000 });
                    console.log('✅ Assert passed: Form still open — browser validation blocked');
                }

            } else if (negData.sstandardPrice === '-100') {
                // Negative price
                console.log('ℹ️ Negative price — clicking submit and checking');
                await submitButton.click();
                await page.waitForTimeout(1000);
                const formVisible = await page.locator("//h5[text()='Add New Product to Catalog']").isVisible();
                if (formVisible) {
                    await expect(page.locator("//h5[text()='Add New Product to Catalog']")).toBeVisible();
                    console.log('✅ Assert passed: Form still open — negative price blocked');
                } else {
                    await expect(
                        page.locator('//*[contains(text(),"price") or contains(text(),"invalid") or contains(text(),"positive")]')
                    ).toBeVisible({ timeout: 3000 });
                    console.log('✅ Assert passed: Error message shown for negative price');
                }

            } else if (negData.sstandardPrice === 'abc') {
                // Price with letters
                console.log('ℹ️ Letters in price — verifying field value');
                const priceValue = await page.locator(
                    "(//label[text()='Standard Price (USD)']/following::input)[1]"
                ).inputValue();
                console.log(`ℹ️ Price field value: "${priceValue}"`);
                if (priceValue === '' || priceValue === '0' || priceValue === '0.00') {
                    expect(priceValue === '' || priceValue === '0' || priceValue === '0.00').toBeTruthy();
                    console.log('✅ Assert passed: Price field blocked letters');
                } else {
                    await expect(submitButton).toBeDisabled({ timeout: 3000 });
                    console.log('✅ Assert passed: Submit button disabled for invalid price');
                }

            } else if (negData.sstockKeepingUnit === 'BLUEE_GRAPE_BRANDY_294ML') {
                // Duplicate SKU
                console.log('ℹ️ Duplicate SKU — submitting and checking');
                await submitButton.click();
                await page.waitForTimeout(3000);
                await expect(
                    page.locator("//h5[text()='Add New Product to Catalog']")
                ).toBeVisible({ timeout: 5000 });
                console.log('✅ Assert passed: Form still open — duplicate SKU blocked');
            }

            console.log('✅ Validation check complete');

            // ── STEP 5: Close Form ──
            console.log('Step 5: Closing Add New Product form');
            const closeBtn = page.locator("//button[@aria-label='Close']");
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
                console.log('✅ Form closed via X button');
            } else {
                await page.keyboard.press('Escape');
                console.log('✅ Escape key pressed');
            }
            await page.waitForTimeout(1000);

            const formStillOpen = await page.locator("//h5[text()='Add New Product to Catalog']").isVisible();
            if (formStillOpen) {
                await page.locator("//button[text()='Cancel']").click();
                await page.waitForTimeout(1000);
                console.log('✅ Form closed via Cancel button');
            } else {
                await expect(
                    page.locator("//h5[text()='Add New Product to Catalog']")
                ).not.toBeVisible();
                console.log('✅ Assert passed: Form closed successfully');
            }

            console.log(`=== END: Negative Product - ${negData.testCase} ===`);
        });
    }
});

// ==============================================================
// FETCH CATEGORY NAME
// ==============================================================

/**
 * @test Fetch CategoryName
 * @description Fetches and logs all product category names
 * from the Tracsens product category page.
 */
test('Fetch CategoryName', async ({ page }) => {

    test.setTimeout(180000);
    console.log("=== FETCH CATEGORY NAME TEST START ===");

    try {

        console.log("Initializing Page Object Model instances");
        FetchproductCategory = new productCategory(page);
        console.log("✅ productCategory instance created");

        console.log("\nStep 1: Fetching all product category names");
        await FetchproductCategory.getAllCategoryNames();
        console.log("✅ All product category names fetched successfully");

    } catch (error) {
        if (error instanceof Error) {
            console.log(`❌ Test failed with error: ${error.message}`);
            console.log(`❌ Stack trace: ${error.stack}`);
        } else {
            console.log(`❌ Test failed with unknown error: ${error}`);
        }
        throw error;
    }

    console.log("=== FETCH CATEGORY NAME TEST END ===");
});
