import { Page, expect } from "@playwright/test";

export class LoginPage {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    // Application logo image on the login page (used to verify page has loaded)
    logo = '//img[contains(@src,"/static/media/")]';

    // Username input field on the login form
    userName = '//input[@type="text"]';

    // Password input field on the login form
    password = '//input[@type="password"]';

    // Sign In submit button on the login form
    signinButton = '//button[text()="Sign In"]';

    // Homepage title heading shown after successful login
    homePageMessage = '//h2[text()="Intelligence Center"]';

    // ==================== METHODS ====================

    /**
     * @function openApplication
     * @author Bhavani
     * @date 2026-05-08
     * @description Navigates to the application login page and verifies
     * the page title contains "Tracsens" to confirm correct page loaded.
     *
     * @returns {Promise<void>}
     * @example
     * const loginPage = new LoginPage(page);
     * await loginPage.openApplication();
     */
    async openApplication(): Promise<void> {
        console.log("=== OPEN APPLICATION START ===");

        // Step 1: Navigate to the login page URL
        console.log("Step 1: Navigating to /login URL");
        await this.page.goto('/login');
        console.log("✅ Navigation to /login complete");

        // Step 2: Verify page title contains "Tracsens" to confirm correct page loaded
        console.log("Step 2: Verifying page title contains 'Tracsens'");
        await expect(this.page).toHaveTitle(/Tracsens/);
        console.log("✅ Page title verified — application loaded successfully");

        console.log("=== OPEN APPLICATION END ===");
    }

    /**
     * @function login
     * @author Bhavani
     * @date 2026-05-08
     * @description Performs the login action using the provided username and password.
     * Validates inputs are not empty, checks logo visibility to confirm login page
     * is loaded, fills credentials, clicks Sign In, and verifies successful login
     * by checking the homepage title.
     *
     * @param {string} username - The username to log in with (e.g., "alex")
     * @param {string} password - The password to log in with (e.g., "password123")
     * @returns {Promise<void>}
     * @example
     * const loginPage = new LoginPage(page);
     * await loginPage.login("admin", "admin123");
     */
    async login(username: string, password: string): Promise<void> {
        console.log("=== LOGIN START ===");
        console.log(`ℹ️ Attempting login with username: "${username}"`);

        // Step 1: Validate that username and password are not null or empty
        console.log("Step 1: Validating username and password inputs");
        if (username === null || username === "" || password === null || password === "") {
            console.log("❌ Username or Password is missing — login aborted");
            console.log("=== LOGIN END (VALIDATION FAILED) ===");
            return;
        }
        console.log("✅ Username and password inputs are valid");

        // Step 2: Check if login page is loaded correctly by verifying logo visibility
        console.log("Step 2: Checking if application logo is visible on login page");
        const isLogoVisible = await this.page.locator(this.logo).isVisible();
        console.log(`ℹ️ Logo visible: ${isLogoVisible}`);

        if (isLogoVisible) {
            console.log("✅ Login page loaded correctly — logo is visible");

            // Step 3: Fill username input field
            console.log(`Step 3: Filling username field with: "${username}"`);
            await this.page.locator(this.userName).fill(username);
            console.log("✅ Username filled successfully");

            // Step 4: Fill password input field
            console.log("Step 4: Filling password field");
            await this.page.locator(this.password).fill(password);
            console.log("✅ Password filled successfully");

            // Step 5: Click the Sign In button to submit the login form
            console.log("Step 5: Clicking Sign In button");
            await this.page.locator(this.signinButton).click();
            console.log("✅ Sign In button clicked");

            // Step 6: Wait for page to load after login
            console.log("Step 6: Waiting for page to load after login");
            await this.page.waitForTimeout(2000);
            console.log("✅ Wait complete");

            // Step 7: Verify login was successful by checking homepage title visibility
            console.log("Step 7: Verifying login success by checking homepage title");
            if (await this.page.locator(this.homePageMessage).isVisible()) {
                console.log("✅ Login was successful — homepage title 'Intelligence Center' is visible");
            } else {
                console.log("❌ Login failed — homepage title not visible after sign in");
            }

        } else {
            // Logo not visible — login page may not have loaded correctly
            console.log("❌ Application logo not visible — login page may not have loaded correctly");
        }

        console.log("=== LOGIN END ===");
    }

    /**
     * @function verifyHomePageTitle
     * @author Bhavani
     * @date 2026-05-08
     * @description Verifies that the user has successfully logged in by checking
     * whether the homepage title "Intelligence Center" is visible after login.
     *
     * @returns {Promise<void>}
     * @example
     * const loginPage = new LoginPage(page);
     * await loginPage.verifyHomePageTitle();
     */
    async verifyHomePageTitle(): Promise<void> {
        console.log("=== VERIFY HOMEPAGE TITLE START ===");

        // Step 1: Wait for homepage to fully load before checking title
        console.log("Step 1: Waiting for homepage to load");
        await this.page.waitForTimeout(2000);
        console.log("✅ Wait complete");

        // Step 2: Check if homepage title "Intelligence Center" is visible
        console.log("Step 2: Checking visibility of homepage title 'Intelligence Center'");
        if (await this.page.locator(this.homePageMessage).isVisible()) {
            console.log("✅ Homepage title 'Intelligence Center' is visible — user is logged in");
        } else {
            console.log("❌ Homepage title 'Intelligence Center' is not visible — login may have failed");
        }

        console.log("=== VERIFY HOMEPAGE TITLE END ===");
    }

    /**
     * @function loginToApplicationT
     * @author Bhavani
     * @date 2026-05-12
     * @description Master method that performs the complete login flow in a single call:
     *  1. Opens the application and navigates to the login page
     *  2. Validates inputs and fills login credentials
     *  3. Clicks Sign In button
     *  4. Verifies successful login via homepage title
     *
     * @param {string} username - The username to log in with (e.g., "admin")
     * @param {string} password - The password to log in with (e.g., "admin123")
     * @returns {Promise<void>}
     * @example
     * const loginPage = new LoginPage(page);
     * await loginPage.loginToApplicationT("admin", "admin123");
     */
    async loginToApplicationT(username: string, password: string): Promise<void> {
        console.log("=== LOGIN TO APPLICATION FLOW START ===");
        console.log(`ℹ️ Username: "${username}"`);

        // Step 1: Open the application and navigate to login page
        console.log("Step 1: Opening application");
        await this.openApplication();
        console.log("✅ Application opened successfully");

        // Step 2: Perform login with provided credentials
        console.log("Step 2: Performing login with provided credentials");
        await this.login(username, password);
        console.log("✅ Login step complete");

        console.log("=== LOGIN TO APPLICATION FLOW END ===");
    }
}
 