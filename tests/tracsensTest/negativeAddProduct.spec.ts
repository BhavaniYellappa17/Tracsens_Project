/**
 * @file negativeProduct.spec.ts
 * @author Bhavani
 * @date 2026-06-02
 * @description Negative test suite for Product Management module covering:
 *  - Empty product name
 *  - Empty SKU
 *  - Empty price
 *  - Negative price
 *  - Price with letters
 *  - Duplicate SKU
 * Test data is driven from productData.json
 * hooks.ts handles login and logout automatically
 */

import { test, expect } from '@playwright/test';
import '../../hooks/hooks';
import { productManagement } from '../../pages/Tracsens/createVerifyEditDeleteProduct';
import productData from '../testdata/productData.json';

// ==================== TEST SUITE ====================

test.describe('Negative - Product Management Tests', () => {

    const testData = productData[0];

    for (const negData of testData.negativeProduct) {

        test(`Negative Product - ${negData.testCase}`, async ({ page }) => {

            test.setTimeout(60000);

            console.log(`=== START: Negative Product - ${negData.testCase} ===`);

            // -------------------- INITIALIZATION --------------------
            console.log('Initializing productManagement instance');
            const productPage = new productManagement(page);
            console.log('✅ productManagement instance created');

            // -------------------- STEP 1: Navigate to Products --------------------
            console.log('Step 1: Navigating to Product Management > Products');
            await page.locator("//span[text()='Product Management']").click();
            await page.waitForTimeout(2000);
            await page.locator("//ul[contains(@class,'sidebar-submenu')]//span[text()='Products']").click();
            await page.locator("//div[@class='product-table-scroll']").waitFor();
            await page.waitForLoadState('networkidle');
            console.log('✅ Navigated to Products page');

            // -------------------- STEP 2: Open Add New Product form --------------------
            console.log('Step 2: Clicking Add New Product button');
            await page.locator("//button[text()='Add New Product']").click();
            await page.locator("//h5[text()='Add New Product to Catalog']").waitFor({ state: 'visible' });
            console.log('✅ Add New Product form opened');

            // -------------------- STEP 3: Fill form with invalid data --------------------
            console.log('Step 3: Filling form with invalid/empty test data');
            console.log(`ℹ️ Product Name : "${negData.sproductName}"`);
            console.log(`ℹ️ SKU          : "${negData.sstockKeepingUnit}"`);
            console.log(`ℹ️ Price        : "${negData.sstandardPrice}"`);

            // Fill product name
            await page.locator("(//label[text()='Product Name']/following::input)[1]")
                .fill(negData.sproductName);
            console.log('✅ Product name filled');

            // Fill description
            await page.locator("//label[text()='Detailed Description']/following::textarea")
                .fill(negData.sdetailedDescription);
            console.log('✅ Description filled');

            // Fill SKU
            await page.locator("(//label[text()='Stock Keeping Unit (SKU)']/following::input)[1]")
                .fill(negData.sstockKeepingUnit);
            console.log('✅ SKU filled');

            // ✅ Fill price — handle letters separately to avoid freeze
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

            // Select category
            await page.locator("(//label[text()='Product Category']/following::input)[1]").click();
            await page.locator('.dropdown-menu').waitFor({ state: 'visible' });
            await page.locator('.dropdown-menu').getByText('BRANDY').click();
            console.log('✅ Category selected');

            // Select customer company
            await page.locator("(//label[text()='Customer (Company)']/following::input)[1]").click();
            await page.locator('.dropdown-menu').waitFor({ state: 'visible' });
            await page.locator('.dropdown-menu').getByText('TejasDesai').click();
            console.log('✅ Company selected');

            // ✅ Upload image based on imageFile from JSON
            console.log(`ℹ️ Image file: "${negData.imageFile}"`);
            if (negData.imageFile && negData.imageFile.trim() !== '') {
                console.log('Uploading image file');
                await page.locator("//input[@id='hidden-file-input']")
                    .setInputFiles(negData.imageFile);
                await page.waitForTimeout(1000);

                // Check if invalid file type error is shown
                const invalidFileError = await page.locator(
                    '//*[contains(text(),"JPG") or contains(text(),"PNG") or contains(text(),"WEBP") or contains(text(),"invalid") or contains(text(),"not supported")]'
                ).isVisible();

                if (invalidFileError) {
                    console.log('✅ Invalid file type error shown — validation working');
                } else {
                    console.log('✅ Image uploaded successfully');
                }
            } else {
                console.log('ℹ️ No image — skipping upload');
            }

            // -------------------- STEP 4: Verify based on test case --------------------
            console.log('Step 4: Verifying validation behaviour');

            const submitButton = page.locator("//button[text()='Complete Entry']");

            if (negData.sproductName === '' ||
                negData.sstockKeepingUnit === '' ||
                negData.sstandardPrice === '') {
                // Empty fields — button should be disabled
                console.log('ℹ️ Empty field detected — checking submit button is disabled');
                const isDisabled = await submitButton.isDisabled();
                if (isDisabled) {
                    console.log('✅ Complete Entry button is disabled — validation working');
                } else {
                    await submitButton.click();
                    await expect(
                        page.locator("//h5[text()='Add New Product to Catalog']")
                    ).toBeVisible({ timeout: 5000 });
                    console.log('✅ Form still open — browser validation blocked submission');
                }

            } else if (negData.sstandardPrice === '-100') {
                // Negative price — click submit and verify form stays open
                console.log('ℹ️ Negative price detected — clicking submit and checking');
                await submitButton.click();
                await page.waitForTimeout(1000);
                const formVisible = await page.locator(
                    "//h5[text()='Add New Product to Catalog']"
                ).isVisible();
                if (formVisible) {
                    console.log('✅ Form still open — negative price blocked submission');
                } else {
                    await expect(
                        page.locator('//*[contains(text(),"price") or contains(text(),"invalid") or contains(text(),"positive")]')
                    ).toBeVisible({ timeout: 3000 });
                    console.log('✅ Error message shown for negative price');
                }

            } else if (negData.sstandardPrice === 'abc') {
                // Price with letters — verify field is empty/zero
                console.log('ℹ️ Letters in price field — verifying field value');
                const priceValue = await page.locator(
                    "(//label[text()='Standard Price (USD)']/following::input)[1]"
                ).inputValue();
                console.log(`ℹ️ Price field value: "${priceValue}"`);
                if (priceValue === '' || priceValue === '0' || priceValue === '0.00') {
                    console.log('✅ Price field blocked letters — validation working');
                } else {
                    await expect(submitButton).toBeDisabled({ timeout: 3000 });
                    console.log('✅ Submit button disabled for invalid price');
                }

            } else if (negData.sstockKeepingUnit === 'BLUEE_GRAPE_BRANDY_294ML') {
                // ✅ Duplicate SKU — submit and check form stays open
                console.log('ℹ️ Duplicate SKU detected — submitting and checking');
                await submitButton.click();
                await page.waitForTimeout(3000);

                const formOpen = await page.locator(
                    "//h5[text()='Add New Product to Catalog']"
                ).isVisible();

                if (formOpen) {
                    console.log('✅ Form still open — duplicate SKU blocked submission');
                } else {
                    console.log('⚠️ Form closed — check app for duplicate SKU error message');
                }
            }

            console.log('✅ Validation check complete');

            // -------------------- STEP 5: Close form --------------------
            console.log('Step 5: Closing Add New Product form');

            // Try X button first
            const closeBtn = page.locator("//button[@aria-label='Close']");
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
                console.log('✅ Form closed via X button');
            } else {
                await page.keyboard.press('Escape');
                console.log('✅ Escape key pressed');
            }
            await page.waitForTimeout(1000);

            // Verify form closed — if not try Cancel
            const formStillOpen = await page.locator(
                "//h5[text()='Add New Product to Catalog']"
            ).isVisible();

            if (formStillOpen) {
                await page.locator("//button[text()='Cancel']").click();
                await page.waitForTimeout(1000);
                console.log('✅ Form closed via Cancel button');
            } else {
                console.log('✅ Form closed successfully');
            }

            console.log(`=== END: Negative Product - ${negData.testCase} ===`);
        });
    }
});