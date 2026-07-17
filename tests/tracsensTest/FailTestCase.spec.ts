/**
 * @file NegativeLogin.spec.ts
 * @author Bhavani
 * @date 2026-07-16
 * @description Dedicated spec file containing ONLY an intentionally failing test case.
 * Purpose: verify that the reporting pipeline (Monocart report + email summary)
 * correctly reflects and displays failures when they occur.
 *
 * ⚠️ This is NOT a real validation of app behavior — it is a controlled failure
 * used purely to confirm the CI/CD reporting pipeline works end-to-end.
 */

import { test, expect, LoginPage } from '../../utils/index';

test.describe('Negative Login - Failure Demo', () => {

    /**
     * @test Demo Failing Test (Wrong Credentials)
     * @description Submits wrong credentials — login correctly gets rejected by
     * the app (real, expected behavior). However, the final assertion deliberately
     * expects the WRONG outcome (redirect to dashboard), which never happens since
     * login failed. This mismatch causes Playwright to mark the test as FAILED.
     */
    test('Negative Login - Demo Failing Test (Wrong Credentials)', async ({ page }) => {

        test.setTimeout(60000);

        console.log(`\n========================================`);
        console.log(`=== START: Demo Failing Test ===`);
        console.log(`========================================`);

        console.log('Step 1: Navigating to login page');
        await page.goto('https://prod.tracsens.com/login', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        await page.waitForLoadState('networkidle');
        console.log('✅ Navigated to login page');

        console.log('Step 2: Filling wrong credentials');
        const usernameField = page.locator('//input[@type="text"]');
        await usernameField.waitFor({ state: 'visible', timeout: 10000 });
        await usernameField.fill('wronguser@test.com');

        const passwordField = page.locator('//input[@type="password"]');
        await passwordField.fill('WrongPassword123');
        console.log('✅ Wrong credentials filled');

        console.log('Step 3: Clicking Sign In button');
        await page.locator('//button[text()="Sign In"]').click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        console.log('✅ Sign In clicked — login expected to fail');

        // ❌ Intentionally WRONG assertion — see file header for explanation
        console.log('Step 4: Asserting (intentionally incorrect) redirect to dashboard');
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });

        console.log(`=== END: Demo Failing Test ===`);
    });
});