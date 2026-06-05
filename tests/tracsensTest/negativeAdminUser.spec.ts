import { test, expect } from '@playwright/test';
import '../../hooks/hooks';
import { adminUserPage } from '../../pages/Tracsens/adminUserPage';
import adminData from '../testdata/adminData.json';

test.describe('Negative - Admin User Tests', () => {

    const testData = adminData[0];

    for (const negData of testData.negativeUser) {

        test(`Negative User - ${negData.testCase}`, async ({ page }) => {

            test.setTimeout(60000);
            console.log(`=== START: ${negData.testCase} ===`);

            const adminUser = new adminUserPage(page);

            // -------------------- STEP 1: Navigate --------------------
            console.log('Step 1: Navigating to Administration > Users');
            await adminUser.adminPage.adminMenuSubmenu(
                testData.menu,
                testData.UserSubMenu
            );
            await page.waitForLoadState('networkidle');
            console.log('✅ Navigated to Users page');

            // -------------------- STEP 2: Open Modal --------------------
            console.log('Step 2: Opening Create User modal');
            await page.getByRole('button', { name: 'Create user' }).click();
            const modalTitle = page.locator('//span[text()="Create user (company)"]');
            await expect(modalTitle).toBeVisible();
            console.log('✅ Create User modal opened');

            // -------------------- STEP 3: Fill Form with invalid data --------------------
            console.log('Step 3: Filling form with invalid data');
            console.log(`ℹ️ Full Name : "${negData.fullName}"`);
            console.log(`ℹ️ Email     : "${negData.Email}"`);
            console.log(`ℹ️ Username  : "${negData.userName}"`);
            console.log(`ℹ️ Password  : "${negData.password}"`);

            // Select customer dropdown (mandatory)
            await page.locator('//label[contains(text(),"Customer")]/following::select[1]')
                .selectOption({ index: 1 });

            await page.locator('[name="fullname"]').fill(negData.fullName);
            await page.locator('[type="email"]').fill(negData.Email);
            await page.locator('[name="username"]').fill(negData.userName);
            await page.locator('[name="password"]').fill(negData.password);

            // Trigger validation
            await page.keyboard.press('Tab');
            await page.waitForTimeout(500);
            console.log('✅ Form filled with invalid test data');

            // -------------------- STEP 4: Verify Add User button is disabled --------------------
            console.log('Step 4: Verifying Add User button is disabled');
            const addUserBtn = page.getByRole('button', { name: 'Add User' });
            await expect(addUserBtn).toBeDisabled({ timeout: 3000 });
            console.log('✅ Add User button is disabled — validation is working correctly');

            // -------------------- STEP 5: Close Modal --------------------
            console.log('Step 5: Closing modal');
            const closeBtn = page.locator('button[aria-label="Close"]');
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
                console.log('✅ Modal closed via Close button');
            } else {
                await page.keyboard.press('Escape');
                console.log('✅ Modal closed via Escape key');
            }
            await page.waitForTimeout(1000);
            await expect(modalTitle).not.toBeVisible();
            console.log('✅ Modal closed confirmed');

            console.log(`=== END: ${negData.testCase} ===`);
        });
    }
});