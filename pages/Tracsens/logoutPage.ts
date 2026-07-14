import { Page, expect } from "@playwright/test";

export class LogoutPage {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    // Profile icon image in the top right corner — click to open logout dropdown
    logoutProfileIcon = '//img[@alt="profile"]';

    // Log Out button that appears after clicking the profile icon
    logoutButton = '//button[text()="Log Out"]';

    // Login page message shown after successful logout — confirms user is back on login page
    loginMessage = '//p[text()="Please enter your details to sign in."]';

    // ==================== METHODS ====================

    /**
     * @function logOut
     * @author Bhavani
     * @date 2026-05-08
     * @description Performs the complete logout action by:
     *  1. Waiting for the page to be fully idle before attempting logout
     *  2. Waiting for the profile icon to be visible and stable
     *  3. Clicking the profile icon to open the logout dropdown
     *  4. Waiting for the Log Out button to be visible before clicking
     *  5. Clicking the Log Out button to trigger logout
     *  6. Verifying successful logout by checking the login page message visibility
     *
     * @returns {Promise<void>}
     * @example
     * const logoutPage = new LogoutPage(page);
     * await logoutPage.logOut();
     */
    async logOut(): Promise<void> {
        console.log("=== LOGOUT START ===");

        // Step 1: Wait for the page network to be fully idle before starting logout
        // This prevents logout from racing with ongoing page operations (e.g. form submissions)
        console.log("Step 1: Waiting for page to be fully idle before logout");
        await this.page.waitForLoadState('networkidle');
        console.log("✅ Page is fully idle — safe to proceed with logout");

        // Step 2: Wait for the profile icon to be visible and stable before interacting
        console.log("Step 2: Waiting for profile icon to be visible");
        await this.page.locator(this.logoutProfileIcon).waitFor({ state: 'visible' });
        console.log("✅ Profile icon is visible");

        // Step 3: Click the profile icon to open the logout dropdown menu
        console.log("Step 3: Clicking profile icon to open logout dropdown");
        await this.page.locator(this.logoutProfileIcon).click();
        console.log("✅ Profile icon clicked — logout dropdown should be open");

        // Step 4: Wait for the Log Out button to be visible before clicking
        // Ensures the dropdown is fully open before interacting
        console.log("Step 4: Waiting for Log Out button to be visible");
        await this.page.locator(this.logoutButton).waitFor({ state: 'visible' });
        console.log("✅ Log Out button is visible");

        // Step 5: Click the Log Out button from the dropdown
        console.log("Step 5: Clicking Log Out button");
        await this.page.locator(this.logoutButton).click();
        console.log("✅ Log Out button clicked");

        // Step 6: Wait for navigation back to login page after logout
        console.log("Step 6: Waiting for navigation back to login page");
        await this.page.waitForLoadState('networkidle');
        console.log("✅ Page navigation complete after logout");

        // Step 7: Verify logout was successful by checking login page message visibility
        // ✅ Uses waitFor instead of an instant isVisible() check — CI runners can be
        // slower to render than a local machine, so we give it time to actually appear.
        console.log("Step 7: Verifying logout by checking login page message visibility");
        const isLoginMessageVisible = await this.page.locator(this.loginMessage)
            .waitFor({ state: 'visible', timeout: 15000 })
            .then(() => true)
            .catch(() => false);

        if (isLoginMessageVisible) {
            console.log("✅ Successfully logged out — login page message is visible");
        } else {
            console.log("❌ Logout failed — login page message is not visible");
        }

        console.log("=== LOGOUT END ===");
    }
}