/**
 * @file negativeLogin.spec.ts
 * @author Bhavani
 * @date 2026-06-02
 * @description Negative test suite for Login module covering:
 *  - Empty username
 *  - Empty password
 *  - Invalid username
 *  - Invalid password
 *  - Both fields empty
 *  - Wrong credentials
 * Test data is driven from loginData.json → invalidLogin array
 * No hooks needed — login page is the entry point, no prior login required
 *
 * @testFile loginData.json - Contains array of invalid login test data records
 * @dependencies
 *  - LoginPage → handles login page interactions
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/Tracsens/loginPage';
import loginData from '../testdata/loginData.json';

// ==============================================================
// ❌ NEGATIVE TESTS — LOGIN VALIDATION
// ==============================================================

/**
 * @describe Negative Login Tests
 * @description Validates login form field validations with invalid credentials.
 * Covers: empty username, empty password, invalid username, invalid password,
 * both fields empty, wrong credentials.
 * Verifies that:
 *  - User stays on the login page after failed login attempt
 *  - Error message is displayed for invalid credentials
 *  - Browser native validation blocks submission for empty fields
 * @testData loginData.json → invalidLogin[]
 */
test.describe('Negative Login Tests', () => {

    for (const data of loginData.invalidLogin) {

        test(`Negative Login - ${data.testCase}`, async ({ page }) => {

            // Set test timeout to 60 seconds
            test.setTimeout(60000);

            console.log(`\n========================================`);
            console.log(`=== START: Negative Login - ${data.testCase} ===`);
            console.log(`ℹ️ Username : "${data.username}"`);
            console.log(`ℹ️ Password : "${data.password}"`);
            console.log(`========================================`);

            // -------------------- INITIALIZATION --------------------

            // Initialize LoginPage POM instance with the current page
            console.log('Initializing LoginPage instance');
            const loginPage = new LoginPage(page);
            console.log('✅ LoginPage instance created');

            // -------------------- STEP 1: Navigate to Login Page --------------------

            // Navigate directly to the login URL — no hooks needed for negative login tests
            console.log('Step 1: Navigating to login page');
            await page.goto('https://prod.tracsens.com/login', {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            await page.waitForLoadState('networkidle');
            console.log('✅ Navigated to login page');

            // ✅ Assert 1: Verify URL contains "login"
            await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
            console.log('✅ Assert 1 passed: URL contains "login"');

            // -------------------- STEP 2: Verify Login Page Loaded --------------------

            // Verify the login page logo is visible to confirm page has fully loaded
            console.log('Step 2: Verifying login page loaded');
            await expect(page.locator('//img[contains(@src,"/static/media/")]')).toBeVisible({ timeout: 10000 });
            console.log('✅ Assert 2 passed: Login page loaded — logo is visible');

            // -------------------- STEP 3: Fill Username --------------------

            // Fill the username input field with test data (may be empty for negative cases)
            console.log(`Step 3: Filling username with: "${data.username}"`);
            await page.locator('//input[@type="text"]').fill(data.username);

            // ✅ Assert 3: Verify username field has the expected value
            await expect(page.locator('//input[@type="text"]')).toHaveValue(data.username);
            console.log(`✅ Assert 3 passed: Username field value is "${data.username}"`);

            // -------------------- STEP 4: Fill Password --------------------

            // Fill the password input field with test data (may be empty for negative cases)
            console.log(`Step 4: Filling password with: "${data.password}"`);
            await page.locator('//input[@type="password"]').fill(data.password);

            // ✅ Assert 4: Verify password field has the expected value
            await expect( page.locator('//input[@type="password"]')).toHaveValue(data.password);
            console.log(`✅ Assert 4 passed: Password field value is "${data.password}"`);

            // -------------------- STEP 5: Click Sign In --------------------

            // Click the Sign In button to trigger validation or login attempt
            console.log('Step 5: Clicking Sign In button');
            await page.locator('//button[text()="Sign In"]').click();
            console.log('✅ Sign In button clicked');

            // -------------------- STEP 6: Wait for Response --------------------

            // Wait for network to settle after login attempt
            console.log('Step 6: Waiting for page response after Sign In');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            console.log('✅ Page response received');

            // -------------------- STEP 7: Verify User Stays on Login Page --------------------

            // User should NOT be redirected to dashboard — must stay on login page
            console.log('Step 7: Verifying user stays on login page');
            await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
            console.log('✅ Assert 5 passed: User remained on login page as expected');

            // -------------------- STEP 8: Verify Validation Behaviour --------------------

            console.log('Step 8: Verifying validation behaviour based on test case');

            if (data.username === '' || data.password === '') {

                // ── Empty Fields Case ──
                // Browser native tooltip "Please fill out this field" appears
                // Playwright cannot detect native browser tooltips
                // So we verify the user stays on login page — Sign In was blocked

                console.log('ℹ️ Empty field detected — verifying browser validation blocked login');

                // ✅ Assert 6: User stays on login page — browser validation blocked submission
                await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
                console.log('✅ Assert 6 passed: Browser validation blocked login — user stays on login page');

                // ✅ Assert 7: Dashboard should NOT be visible — login was blocked
                await expect(page.locator('//a[contains(@class,"sidebar-link")]')).not.toBeVisible({ timeout: 3000 });
                console.log('✅ Assert 7 passed: Dashboard not visible — login was blocked');

            } else {

                // ── Invalid Credentials Case ──
                // App shows a red error box with "Invalid username or password" message

                console.log('ℹ️ Invalid credentials detected — verifying error message is displayed');

                // ✅ Assert 6: Red error message box is visible
                await expect(page.locator('//div[contains(@class,"glass-alert") and contains(.,"Invalid username or password")]')).toBeVisible({ timeout: 7000 });
                console.log('✅ Assert 6 passed: Error message "Invalid username or password" is displayed');

                // ✅ Assert 7: User stays on login page — not redirected to dashboard
                await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
                console.log('✅ Assert 7 passed: User stayed on login page after invalid credentials');

                // ✅ Assert 8: Dashboard sidebar should NOT be visible — login failed
                await expect(page.locator('//a[contains(@class,"sidebar-link")]')).not.toBeVisible({ timeout: 3000 });
                console.log('✅ Assert 8 passed: Dashboard not visible — login failed as expected');
            }

            console.log(`\n✅ All assertions passed for: "${data.testCase}"`);
            console.log(`=== END: Negative Login - ${data.testCase} ===`);
        });
    }
});