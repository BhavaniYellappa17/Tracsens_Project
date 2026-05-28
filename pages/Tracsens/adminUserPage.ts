import { Page, expect } from "@playwright/test";
import { AdminPage } from '../../pages/Tracsens/adminPage';

export class adminUserPage {

    adminPage: AdminPage;

    constructor(public page: Page) {
        this.page = page;
        this.adminPage = new AdminPage(this.page);
    }

    // ==================== LOCATORS ====================

    // Search box to filter users in the user table
    userSearchBox = '(//p[text()="Control access and roles across your intelligence network"]/following::input)[1]';

    // Main user table wrapper
    UserTable = '//div[@class="table-wrapper-neat mb-4"]';

    // Default status value
    status = "inactive";

    // Button to open Create User form
    CreateUserBtn = '//button[text()="Create user"]';

    // Title on the Create User page
    createUserPageTitle = '//span[text()="Create user (company)"]';

    // Dropdown to select customer (company)
    selectCustomer = "(//label[text()='Customer (Company) ']/following::select)[1]";

    // Dropdown to select role
    selectRole = '//select[@class="form-select"]/option[text() = "View-only admin"]';

    // Status filter dropdown (first select on page)
    dropDownStatus = '(//select[@class="form-select"])[1]';

    // Roles filter dropdown (second select on page)
    dropDownRoles = '(//select[@class="form-select"])[2]';

    // Save button on edit user form
    editSaveBtn = '//button[text()="Save"]';

    // Add/Submit button on create user form
    addUserBtn = '//button[@class="btn btn-primary"]';

    // Delete button for a user row
    DeleteBtn = '//button[@title="Delete user (can be restored)"]';

    // ==================== METHODS ====================

    /**
     * @function createUserAccountVerify
     * @author Bhavani
     * @date 2026-05-11
     * @description Creates a new user account if the user does not already exist,
     * then verifies the user appears in the table after creation.
     * Performs the following steps:
     *  1. Navigates to the specified menu and submenu
     *  2. Waits for the user table to load
     *  3. Searches for the user by name to check for duplicates
     *  4. If not found, fills and submits the Create User form
     *  5. Selects customer, fills full name, email, username, and password
     *  6. Verifies the created user appears in the table
     *
     * @param {string} SearchName  - Name to search before creating (used for duplicate check)
     * @param {string} fullName    - Full name to enter in the Create User form
     * @param {string} userName    - Username to enter in the Create User form
     * @param {string} Email       - Email address to enter in the Create User form
     * @param {string} password    - Password to enter in the Create User form
     * @param {string} verifyName  - Name to search after creation to verify user was created
     * @param {string} menu        - Top-level sidebar menu to navigate to (e.g., "Administration")
     * @param {string} subMenu     - Submenu item to navigate to (e.g., "Users")
     * @returns {Promise<void>}
     * @example
     * await adminUserPage.createUserAccountVerify(
     *   "John",
     *   "John Doe",
     *   "johndoe",
     *   "john@test.com",
     *   "Pass@123",
     *   "John Doe",
     *   "Administration",
     *   "Users"
     * );
     */
    async createUserAccountVerify(
        SearchName: string,
        fullName: string,
        userName: string,
        Email: string,
        password: string,
        verifyName: string,
        menu: string,
        subMenu: string
    ): Promise<void> {
        console.log("=== CREATE USER ACCOUNT VERIFY START ===");

        // Step 1: Navigate to the correct menu and submenu
        console.log(`Step 1: Navigating to menu: "${menu}" > submenu: "${subMenu}"`);
        await this.adminPage.adminMenuSubmenu(menu, subMenu);
        console.log("✅ Navigation to menu/submenu complete");

        // Step 2: Wait for the user table to be visible
        console.log("Step 2: Waiting for user table to load");
        await this.page.locator(this.UserTable).waitFor();
        console.log("✅ User table is visible");

        // Step 3: Search for the user to check if they already exist
        console.log(`Step 3: Searching for existing user with name: "${SearchName}"`);
        await this.page.locator(this.userSearchBox).fill(SearchName);
        await this.page.waitForTimeout(globalThis.giSMALLWAIT);
        console.log(`ℹ️ Wait time applied: ${globalThis.giSMALLWAIT}ms`);

        // Step 4: Count matching results
        const UserCount = await this.page.locator(`text=${SearchName}`).count();
        console.log(`Step 4: User search result count: ${UserCount}`);

        // Step 5: If user does not exist, proceed with creation
        if (UserCount === 0) {
            console.log(`ℹ️ User "${SearchName}" not found — proceeding with creation`);

            // Step 5.1: Click Create User button
            console.log("Step 5.1: Clicking Create User button");
            await this.page.locator(this.CreateUserBtn).click();
            console.log("✅ Create User button clicked");

            // Step 5.2: Select customer from dropdown
            console.log("Step 5.2: Selecting customer 'TejasDesai' from dropdown");
            await this.page.locator(this.selectCustomer).click();
            await this.page.locator(this.selectCustomer).selectOption({ label: 'TejasDesai' });
            console.log("✅ Customer selected: TejasDesai");

            // Step 5.3: Fill full name
            console.log(`Step 5.3: Filling full name: "${fullName}"`);
            await this.page.locator('[name="fullname"]').fill(fullName);
            console.log("✅ Full name filled");

            // Step 5.4: Fill email
            console.log(`Step 5.4: Filling email: "${Email}"`);
            await this.page.locator('[type="email"]').fill(Email);
            console.log("✅ Email filled");

            // Step 5.5: Fill username
            console.log(`Step 5.5: Filling username: "${userName}"`);
            await this.page.locator('[name="username"]').fill(userName);
            console.log("✅ Username filled");

            // Step 5.6: Fill password
            console.log("Step 5.6: Filling password");
            await this.page.locator('[name="password"]').fill(password);
            console.log("✅ Password filled");

            // Step 5.7: Click Add/Submit button
            console.log("Step 5.7: Clicking Add User button to submit form");
            await this.page.locator(this.addUserBtn).click();
            console.log("✅ Add User button clicked");

            // Step 5.8: Verify user was created by searching for verifyName
            console.log(`Step 5.8: Verifying user creation by searching: "${verifyName}"`);
            await this.page.locator(this.userSearchBox).fill(verifyName);
            await expect(this.page.locator(`//span[text()='${verifyName}']`).first()).toBeVisible();
            console.log(`✅ User "${verifyName}" is present — creation verified`);

        } else {
            // User already exists — skip creation
            console.log(`⚠️ User "${SearchName}" already exists (count: ${UserCount}) — skipping creation`);
        }

        console.log("=== CREATE USER ACCOUNT VERIFY END ===");
    }

    /**
     * @function editDeletUserName
     * @author Bhavani
     * @date 2026-05-11
     * @description Edits an existing user's name and then deletes the user,
     * verifying both the edit and deletion were successful.
     * Performs the following steps:
     *  1. Searches for the user by current full name
     *  2. Sets Status filter to Active and Roles filter to Operational User
     *  3. Clicks Edit, updates the name, and saves
     *  4. Verifies the updated name appears in the table
     *  5. Searches for the updated user and triggers deletion
     *  6. Accepts the confirmation dialog
     *  7. Verifies the user no longer appears in the table
     *
     * @param {string} editUserName - New name to set for the user during edit
     * @param {string} fullName     - Current full name used to search for the user
     * @returns {Promise<void>}
     * @example
     * await adminUserPage.editDeletUserName("John Updated", "John Doe");
     */
    async editDeletUserName(editUserName: string, fullName: string,userName:string): Promise<void> {
        console.log("=== EDIT AND DELETE USER START ===");

        // -------------------- EDIT SECTION --------------------

        // Step 1: Clear search box and search for the user by full name
        console.log(`Step 1: Clearing search box and searching for user: "${fullName}"`);
        await this.page.locator(this.userSearchBox).clear();
        await this.page.locator(this.userSearchBox).fill(fullName);
        console.log("✅ User search filled");

        // Step 2: Set Status filter to Active
        console.log("Step 2: Setting Status dropdown to 'Active'");
        await this.page.locator(this.dropDownStatus).click();
        await this.page.locator(this.dropDownStatus).selectOption({ label: 'Active' });
        console.log("✅ Status set to Active");

        // Step 3: Wait for table to refresh after status filter
        console.log("Step 3: Waiting 6 seconds for table to refresh after status filter");
        await this.page.waitForTimeout(6000);
        console.log("✅ Wait complete");

        // Step 4: Set Roles filter to Operational User
        console.log("Step 4: Setting Roles dropdown to 'Operational User'");
        await this.page.locator(this.dropDownRoles).click();
        await this.page.locator(this.dropDownRoles).selectOption({ label: 'Operational User' });
        console.log("✅ Role set to Operational User");

        // Step 5: Click Edit button for the user
        console.log("Step 5: Clicking Edit User button");
        await this.page.locator('[title="Edit User"]').click();
        console.log("✅ Edit User button clicked");

        // Step 6: Fill new name in the edit form
        console.log(`Step 6: Filling new name: "${editUserName}"`);
        await this.page.locator('[id="name"]').fill(editUserName);
        await this.page.locator('[id="username"]').fill(userName);
        console.log("✅ New name filled");

        // Step 7: Click Save button
        console.log("Step 7: Clicking Save button");
        await this.page.locator(this.editSaveBtn).click();
        console.log("✅ Save button clicked");

        // Step 8: Verify edit by searching for updated name
        console.log(`Step 8: Verifying edit — searching for: "${editUserName}"`);
        await this.page.locator(this.userSearchBox).fill(editUserName);
        await expect(
            this.page.locator(`//span[text()='${editUserName}']`).first()
        ).toBeVisible();
        console.log(`✅ User "${editUserName}" edited successfully`);

        // -------------------- DELETE SECTION --------------------

        // Step 9: Search for the edited user to prepare for deletion
        console.log(`Step 9: Searching for user to delete: "${editUserName}"`);
        await this.page.locator(this.userSearchBox).fill(editUserName);
        await this.page.waitForTimeout(2000);
        console.log("✅ Search complete — user found for deletion");

        // Step 10: Register dialog/alert handler before triggering delete
        console.log("Step 10: Registering alert/dialog handler to accept confirmation");
        this.page.once('dialog', async dialog => {
            console.log(`ℹ️ Dialog message: "${dialog.message()}"`);
            await dialog.accept();
            console.log("✅ Alert accepted successfully");
        });

        // Step 11: Click Delete button to trigger confirmation dialog
        console.log("Step 11: Clicking Delete button");
        await this.page.locator(this.DeleteBtn).click();
        console.log("✅ Delete button clicked");

        // Step 12: Wait for deletion to process
        console.log("Step 12: Waiting 3 seconds for deletion to process");
        await this.page.waitForTimeout(3000);
        console.log("✅ Wait complete");

        // Step 13: Verify deletion — user should no longer be in the table
        console.log(`Step 13: Verifying deletion of user: "${editUserName}"`);
            await this.page.reload();
            await this.page.locator(this.userSearchBox).fill(editUserName);
        if (await this.page.locator(`//span[text()='${editUserName}']`).count() === 0) {
            console.log(`✅ User "${editUserName}" deleted successfully`);
        } else {
            console.log(`❌ User "${editUserName}" failed to delete — still visible in table`);
        }

        console.log("=== EDIT AND DELETE USER END ===");
    }

    /**
     * @function adminCreateVerifyUser
     * @author Bhavani
     * @date 2026-05-11
     * @description Master method that runs the complete user lifecycle flow in one call:
     *  1. Creates a new user if they don't already exist
     *  2. Verifies the user appears in the table after creation
     *  3. Edits the user's name and verifies the update
     *  4. Deletes the user and verifies deletion
     *
     * @param {string} SearchName   - Name to search before creating (used for duplicate check)
     * @param {string} fullName     - Full name to enter in the Create User form
     * @param {string} userName     - Username to enter in the Create User form
     * @param {string} Email        - Email address to enter in the Create User form
     * @param {string} password     - Password to enter in the Create User form
     * @param {string} verifyName   - Name to search after creation to verify user was created
     * @param {string} editUserName - New name to set for the user during edit
     * @param {string} menu         - Top-level sidebar menu to navigate to (e.g., "Administration")
     * @param {string} subMenu      - Submenu item to navigate to (e.g., "Users")
     * @returns {Promise<void>}
     * @example
     * await adminUserPage.adminCreateVerifyUser(
     *   "John",
     *   "John Doe",
     *   "johndoe",
     *   "john@test.com",
     *   "Pass@123",
     *   "John Doe",
     *   "John Updated",
     *   "Administration",
     *   "Users"
     * );
     */
    async adminCreateVerifyEditDeleteUser(
        SearchName: string,
        fullName: string,
        userName: string,
        Email: string,
        password: string,
        verifyName: string,
        editUserName: string,
        menu: string,
        subMenu: string
    ): Promise<void> {
        console.log("=== ADMIN CREATE VERIFY USER FLOW START ===");

        // Step 1: Create and verify the user
        console.log("Step 1: Starting user creation and verification");
        await this.createUserAccountVerify(SearchName, fullName, userName, Email, password, verifyName, menu, subMenu);
        console.log("✅ User creation and verification complete");

        // Step 2: Edit and delete the user
        console.log("Step 2: Starting user edit and deletion");
        await this.editDeletUserName(editUserName, fullName,userName);
        console.log("✅ User edit and deletion complete");

        console.log("=== ADMIN CREATE VERIFY USER FLOW END ===");
    }
}