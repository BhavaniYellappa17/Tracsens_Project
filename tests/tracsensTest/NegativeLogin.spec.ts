import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/Tracsens/loginPage';
import loginData from '../testdata/loginData.json';

test.describe('Negative Login Tests', () => {

    for (const data of loginData.invalidLogin) {
        test(`Negative Login - ${data.testCase}`, async ({ page }) => {

            console.log(`=== Running: ${data.testCase} ===`);
            const loginPage = new LoginPage(page);

            // -------------------- STEP 1: Navigate to login page --------------------
            console.log('Step 1: Navigating to login page');
            await page.goto('https://prod.tracsens.com/login', {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            await page.waitForLoadState('networkidle');
            console.log('✅ Navigated to login page');

            // -------------------- STEP 2: Verify login page loaded --------------------
            console.log('Step 2: Verifying login page loaded');
            await expect(page.locator('//img[contains(@src,"/static/media/")]')).toBeVisible({ timeout: 10000 });
            console.log('✅ Login page loaded — logo is visible');

            // -------------------- STEP 3: Fill username --------------------
            console.log(`Step 3: Filling username with: "${data.username}"`);
            await page.locator('//input[@type="text"]').fill(data.username);
            console.log('✅ Username filled');

            // -------------------- STEP 4: Fill password --------------------
            console.log(`Step 4: Filling password with: "${data.password}"`);
            await page.locator('//input[@type="password"]').fill(data.password);
            console.log('✅ Password filled');

            // -------------------- STEP 5: Click Sign In --------------------
            console.log('Step 5: Clicking Sign In button');
            await page.locator('//button[text()="Sign In"]').click();
            console.log('✅ Sign In button clicked');

            // -------------------- STEP 6: Wait for response --------------------
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);

            // -------------------- STEP 7: Verify user stays on login page --------------------
            console.log('Step 7: Verifying user stays on login page');
            await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
            console.log('✅ User remained on login page as expected');

            // -------------------- STEP 8: Verify error message --------------------
         
console.log('Step 8: Verifying error message is displayed');

if (data.username === '' || data.password === '') {
    // Empty fields show browser native tooltip "Please fill out this field"
    // Playwright cannot locate native browser tooltips
    // So we just verify user stays on login page — Sign In was blocked
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    console.log('✅ Browser validation blocked login — user stays on login page');

} else {
    // Invalid credentials show the red error box
    await expect(
        page.locator('//div[contains(@class,"glass-alert") and contains(.,"Invalid username or password")]')
    ).toBeVisible({ timeout: 7000 });
    console.log('✅ Error message displayed — Negative test passed');
}
            });
            }
            });