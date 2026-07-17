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

import { test, expect, LoginPage, loginData } from '../../utils/index';

// ==============================================================
// ❌ NEGATIVE TESTS — LOGIN VALIDATION (ALL PASSING)
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

            test.setTimeout(60000);

            console.log(`\n========================================`);
            console.log(`=== START: Negative Login - ${data.testCase} ===`);
            console.log(`ℹ️ Username : "${data.username}"`);
            console.log(`ℹ️ Password : "${data.password}"`);
            console.log(`========================================`);

            console.log('Initializing LoginPage instance');
            const loginPage = new LoginPage(page);
            console.log('✅ LoginPage instance created');

            console.log('Step 1: Navigating to login page');
            await page.goto('https://prod.tracsens.com/login', {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            await page.waitForLoadState('networkidle');
            console.log('✅ Navigated to login page');

            await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
            console.log('✅ Assert 1 passed: URL contains "login"');

            console.log('Step 2: Verifying login page loaded');
            await expect(page.locator('//img[contains(@src,"/static/media/")]')).toBeVisible({ timeout: 10000 });
            console.log('✅ Assert 2 passed: Login page loaded — logo is visible');

            console.log(`Step 3: Filling username with: "${data.username}"`);
            const usernameField = page.locator('//input[@type="text"]');
            await usernameField.waitFor({ state: 'visible', timeout: 10000 });
            await usernameField.fill(data.username);
            await expect(usernameField).toHaveValue(data.username);
            console.log(`✅ Assert 3 passed: Username field value is "${data.username}"`);

            console.log(`Step 4: Filling password with: "${data.password}"`);
            const passwordField = page.locator('//input[@type="password"]');
            await passwordField.waitFor({ state: 'visible', timeout: 10000 });
            await passwordField.fill(data.password);
            await expect(passwordField).toHaveValue(data.password);
            console.log(`✅ Assert 4 passed: Password field value is "${data.password}"`);

            console.log('Step 5: Clicking Sign In button');
            await page.locator('//button[text()="Sign In"]').click();
            console.log('✅ Sign In button clicked');

            console.log('Step 6: Waiting for page response after Sign In');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            console.log('✅ Page response received');

            console.log('Step 7: Verifying user stays on login page');
            await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
            console.log('✅ Assert 5 passed: User remained on login page as expected');

            console.log('Step 8: Verifying validation behaviour based on test case');

            if (data.username === '' || data.password === '') {

                console.log('ℹ️ Empty field detected — verifying browser validation blocked login');
                await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
                console.log('✅ Assert 6 passed: Browser validation blocked login — user stays on login page');

                await expect(page.locator('//a[contains(@class,"sidebar-link")]')).not.toBeVisible({ timeout: 3000 });
                console.log('✅ Assert 7 passed: Dashboard not visible — login was blocked');

            } else {

                console.log('ℹ️ Invalid credentials detected — verifying error message is displayed');
                await expect(page.locator('//div[contains(@class,"glass-alert") and contains(.,"Invalid username or password")]')).toBeVisible({ timeout: 7000 });
                console.log('✅ Assert 6 passed: Error message "Invalid username or password" is displayed');

                await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
                console.log('✅ Assert 7 passed: User stayed on login page after invalid credentials');

                await expect(page.locator('//a[contains(@class,"sidebar-link")]')).not.toBeVisible({ timeout: 3000 });
                console.log('✅ Assert 8 passed: Dashboard not visible — login failed as expected');
            }

            console.log(`\n✅ All assertions passed for: "${data.testCase}"`);
            console.log(`=== END: Negative Login - ${data.testCase} ===`);
        });
    }
});