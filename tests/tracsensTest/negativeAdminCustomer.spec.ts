/**
 * @file negativeAdminCustomer.spec.ts
 * @author Bhavani
 * @date 2026-06-02
 * @description Negative test suite for Admin Customer module covering:
 *  - Empty customer name
 *  - Empty email
 *  - Invalid email format
 *  - Phone more than 10 digits
 * Test data is driven from adminData.json
 * hooks.ts handles login and logout automatically
 */

import { test, expect } from '@playwright/test';
import '../../hooks/hooks';
import { adminCustomerPage } from '../../pages/Tracsens/adminCustomerPage';
import adminData from '../testdata/adminData.json';

// ==================== TEST SUITE ====================

test.describe('Negative - Admin Customer Tests', () => {

    for (const negData of adminData[0].negativeCustomer) {

        test(`Negative Customer - ${negData.testCase}`, async ({ page }) => {

            // Set test timeout
            test.setTimeout(60000);

            console.log(`=== Negative Customer Test START: ${negData.testCase} ===`);

            // -------------------- INITIALIZATION --------------------
            console.log('Initializing adminCustomerPage instance');
            const adminCustomer = new adminCustomerPage(page);
            console.log('✅ adminCustomerPage instance created');

            // -------------------- STEP 1: Navigate to Customers --------------------
            // No login needed — hooks.ts handles login automatically
            console.log('Step 1: Navigating to Administration > Customers');
            await adminCustomer.adminPage.adminMenuSubmenu(
                adminData[0].menu,
                adminData[0].customerSubMenu
            );
            await page.waitForLoadState('networkidle');
            console.log('✅ Navigated to Customers page');

            // -------------------- STEP 2: Click Create Customer --------------------
            console.log('Step 2: Clicking Create Customer button');
            await page.locator('//button[text()="Create customer"]').click();
            await page.waitForTimeout(1000);
            console.log('✅ Create Customer modal opened');

            // -------------------- STEP 3: Fill form with invalid data --------------------
           console.log('Step 3: Filling form with invalid/empty test data');
           console.log(`ℹ️ Name  : "${negData.customerName}"`);
           console.log(`ℹ️ Email : "${negData.customerEmail}"`);
           console.log(`ℹ️ Phone : "${negData.customerPhone}"`);

            await page.locator('//input[@id="modal-name"]').fill(negData.customerName);
            await page.locator('//input[@id="modal-email"]').fill(negData.customerEmail);
            await page.locator('//input[@id="modal-phone"]').fill(negData.customerPhone);

           // Upload logo only if imagePath is provided and not empty
            console.log(`ℹ️ Checking imagePath — value: "${negData.imagePath}" | length: ${negData.imagePath.length}`);
            if (negData.imagePath && negData.imagePath.trim() !== '') {
                console.log(`ℹ️ Uploading logo: "${negData.imagePath}"`);
                await page.locator('//input[@type="file"]').setInputFiles(negData.imagePath);
                await page.waitForTimeout(1000);
                console.log('✅ Logo uploaded successfully');
            } else {
                console.log('ℹ️ No logo — skipping upload for this test case');
            }

console.log('✅ Form filled with test data');

            // -------------------- STEP 4: Click Submit --------------------
            console.log('Step 4: Clicking Submit button');
            await page.locator('//button[@type="submit"]').click();
            await page.waitForTimeout(2000);
            console.log('✅ Submit button clicked');

            // -------------------- STEP 5: Verify validation --------------------
            console.log('Step 5: Verifying validation behaviour');

            if (negData.customerName === '' || negData.customerEmail === '') {
                // Empty fields — browser native tooltip blocks submission
                console.log('ℹ️ Empty field detected — verifying modal stays open');
                await expect(
                    page.locator('//h5[text()="Create customer"]')
                ).toBeVisible({ timeout: 5000 });
                console.log('✅ Modal still open — browser validation blocked submission');

            } else if (!negData.customerEmail.includes('@')) {
                // Invalid email format — browser native validation blocks submission
                console.log('ℹ️ Invalid email format detected — verifying modal stays open');
                await expect(
                    page.locator('//h5[text()="Create customer"]')
                ).toBeVisible({ timeout: 5000 });
                console.log('✅ Modal still open — invalid email blocked submission');

            } else if (negData.customerPhone.length > 10) {
                // Phone more than 10 digits — app validation blocks submission
                console.log('ℹ️ Phone > 10 digits detected — verifying modal stays open');
                await expect(
                    page.locator('//h5[text()="Create customer"]')
                ).toBeVisible({ timeout: 5000 });
                console.log('✅ Modal still open — phone validation blocked submission');
            }
        
        // -------------------- STEP 6: Close modal --------------------
            console.log('Step 6: Closing modal before logout');
            await page.locator('//button[@aria-label="Close"]').click();
            await page.waitForTimeout(1000);
            console.log('✅ Modal closed — ready for logout');
            console.log(`=== Negative Customer Test END: ${negData.testCase} ===`);
        });
    }
});