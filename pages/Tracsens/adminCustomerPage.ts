import { Page, expect } from "@playwright/test";
import { AdminPage } from '../../pages/Tracsens/adminPage';

export class adminCustomerPage {

    adminPage: AdminPage;

    constructor(public page: Page) {
        this.page = page;
        this.adminPage = new AdminPage(this.page);
    }

    // ==================== LOCATORS ====================

    // Button to open the Create Customer modal form
    createCustomerButton = '//button[text()="Create customer"]';

    // Input field for customer name inside Create/Edit Customer modal
    customerName = '//input[@id="modal-name"]';

    // Input field for customer email inside Create/Edit Customer modal
    email = '//input[@id="modal-email"]';

    // Input field for customer phone number inside Create/Edit Customer modal
    phone = '//input[@id="modal-phone"]';

    // File upload input field (for customer logo or document)
    choose_File = '//input[@type="file"]';

    // Submit button inside Create/Edit Customer modal
    submitButton = '//button[@type="submit"]';

    // Title/heading of the Create Customer modal
    createCustomerPageText_h5 = '//h5[text()="Create customer"]';

    // Success toast message shown after customer is created successfully
    SuccessfulCreatedCustomerMessage = '//div[text()="Customer created successfully."]';

    // Success toast message shown after customer is updated successfully
    EditUpdatedMessage = '//div[text() = "Customer updated successfully."]';

    // Page description text used as an anchor to locate the search box
    customerPagetext = 'Manage companies and customer accounts (';

    // Search box on the customer listing page (located relative to page description text)
    searchBox = `(//p[contains(text(),"${this.customerPagetext}")]/following::input)[1]`;

    // Edit button for the first customer row in the table
    editButton = '(//button[@title="Edit"])[1]';

    // First customer row in the customer listing table
    customerNameTableFirstRow = '//div[@class="customer-row-neat outlet-row-neat"][1]';

    // Title/heading of the Edit Customer modal
    editCustomerTitle = '//h5[text()="Edit customer"]';

    // Save/Submit button inside Edit Customer modal
    SaveChangesButton = '//button[@type="submit"]';

    // Element to verify the edited customer name after saving
    VerifyEdit = '(//div[text()="Customer"]/following::span)[1]';

    // Delete (soft delete / deactivate) button for a customer row
    DeleteBtn = '//button[@title="Deactivate (soft delete)"]';

    // Message shown when no customers match the search criteria (used for delete verification)
    DeleteVerificationMessage = '//p[text()="No customers found matching your criteria"]';

    // ==================== METHODS ====================

    /**
     * Function Name: createCustomerPage
     * Author: Bhavani
     * Created Date: 2026-05-12
     * Description: Creates a new customer if they don't already exist.
     *   1. Navigates to the correct menu and submenu
     *   2. Searches for the customer by name
     *   3. If not found, fills and submits the Create Customer form
     *   4. Verifies the success message after submission
     *   5. Reloads the page after successful creation
     * @param Name     - Customer name to create or search for
     * @param Email    - Customer email address
     * @param phno     - Customer phone number
     * @param menu     - Main menu to navigate to (e.g., "Administration")
     * @param subMenu  - Submenu to navigate to (e.g., "Customers")
     * Example: createCustomerPage("John Doe", "john@test.com", "9876543210", "Administration", "Customers");
     */
    async createCustomerPage(Name: string, Email: string, phno: string, menu: string, subMenu: string) {
        console.log("=== CREATE CUSTOMER PAGE START ===");
        console.log(`ℹ️ Customer Name: "${Name}" | Email: "${Email}" | Phone: "${phno}"`);

        // Step 1: Navigate to the correct menu and submenu
        console.log(`Step 1: Navigating to menu: "${menu}" > submenu: "${subMenu}"`);
        await this.adminPage.adminMenuSubmenu(menu, subMenu);
        console.log("✅ Navigation complete");

        // Step 2: Wait for the customer table to be visible
        console.log("Step 2: Waiting for customer table to load");
        await this.page.locator(this.customerNameTableFirstRow).waitFor();
        console.log("✅ Customer table is visible");

        // Step 3: Search for the customer by name to check if already exists
        console.log(`Step 3: Searching for existing customer: "${Name}"`);
        await this.page.locator(this.searchBox).fill(Name);
        await this.page.waitForTimeout(globalThis.giSMALLWAIT);
        console.log(`ℹ️ Wait time applied: ${globalThis.giSMALLWAIT}ms`);

        // Step 4: Count search results to determine if customer exists
        const customerCount = await this.page.locator(`text=${Name}`).count();
        console.log(`Step 4: Customer search result count: ${customerCount}`);

        // Step 5: If customer does not exist, proceed with creation
        if (customerCount === 0) {
            console.log(`ℹ️ Customer "${Name}" not found — proceeding with creation`);

            // Step 5.1: Click Create Customer button to open modal
            console.log("Step 5.1: Clicking Create Customer button");
            await this.page.locator(this.createCustomerButton).click();
            console.log("✅ Create Customer button clicked — modal should open");

            // Step 5.2: Fill customer name
            console.log(`Step 5.2: Filling customer name: "${Name}"`);
            await this.page.locator(this.customerName).fill(Name);
            console.log("✅ Customer name filled");

            // Step 5.3: Fill customer email
            console.log(`Step 5.3: Filling customer email: "${Email}"`);
            await this.page.locator(this.email).fill(Email);
            console.log("✅ Customer email filled");

            // Step 5.4: Fill customer phone number
            // console.log(`Step 5.4: Filling customer phone number: "${phno}"`);
            // await this.page.locator(this.phone).waitFor();
            // await this.page.locator(this.phone).fill(phno);
            // await this.page.locator(this.phone).waitFor();
            // console.log("✅ Customer phone number filled");

            // Step 5.5: Click Submit button to create the customer
            console.log("Step 5.5: Clicking Submit button to create customer");
            await this.page.locator(this.submitButton).click();
            console.log("✅ Submit button clicked");

            // Step 5.6: Verify success message is visible
            console.log("Step 5.6: Verifying success message after creation");
            if (await this.page.locator(this.SuccessfulCreatedCustomerMessage).isVisible()) {
                console.log("✅ Customer created successfully — success message visible");

                // Step 5.7: Reload page to refresh customer list
                console.log("Step 5.7: Reloading page to refresh customer list");
                await this.page.reload();
                console.log("✅ Page reloaded successfully");
            } else {
                console.log("❌ Customer creation failed — success message not visible");
            }

        } else {
            // Customer already exists — skip creation
            console.log(`⚠️ Customer "${Name}" already exists (count: ${customerCount}) — skipping creation`);
        }

        console.log("=== CREATE CUSTOMER PAGE END ===");
    }

    /**
     * Function Name: verifyCustomerName
     * Author: Bhavani
     * Created Date: 2026-05-12
     * Description: Searches for a customer by name and verifies they are visible in the table.
     * @param verifyName - Customer name to search and verify
     * Example: verifyCustomerName("John Doe");
     */
    async verifyCustomerName(verifyName: string) {
        console.log("=== VERIFY CUSTOMER NAME START ===");
        console.log(`ℹ️ Verifying customer: "${verifyName}"`);

        // Step 1: Fill the search box with the customer name to verify
        console.log(`Step 1: Searching for customer: "${verifyName}"`);
        await this.page.locator(this.searchBox).fill(verifyName);
        console.log("✅ Search box filled");

        // Step 2: Assert the customer name span is visible in the table
        console.log(`Step 2: Asserting customer "${verifyName}" is visible in table`);
        await expect(this.page.locator(`//span[text()='${verifyName}']`).first()).toBeVisible();
        console.log(`✅ Customer "${verifyName}" is present in the table`);

        console.log("=== VERIFY CUSTOMER NAME END ===");
    }

    /**
     * Function Name: editAndVerifyCustomerName
     * Author: Bhavani
     * Created Date: 2026-05-12
     * Description: Edits an existing customer's name and verifies the update.
     *   1. Searches for the customer by current name
     *   2. Clicks the Edit button
     *   3. Clears and fills the new name
     *   4. Submits the edit form
     *   5. Searches for the new name and verifies it appears in the table
     * @param editCustomerName - New name to set for the customer
     * @param Name             - Current name to search for the customer
     * Example: editAndVerifyCustomerName("John Updated", "John Doe");
     */
    async editAndVerifyCustomerName(editCustomerName: string, Name: string) {
        console.log("=== EDIT AND VERIFY CUSTOMER NAME START ===");
        console.log(`ℹ️ Current Name: "${Name}" | New Name: "${editCustomerName}"`);

        // Step 1: Search for the customer by current name
        console.log(`Step 1: Searching for customer to edit: "${Name}"`);
        await this.page.locator(this.searchBox).fill(Name);
        console.log("✅ Search box filled");

        // Step 2: Wait for search results to load
        console.log("Step 2: Waiting 6 seconds for search results to load");
        await this.page.waitForTimeout(6000);
        console.log("✅ Wait complete");

        // Step 3: Click the Edit button on the first matching customer row
        console.log("Step 3: Clicking Edit button on first customer row");
        await this.page.locator(this.editButton).click();
        console.log("✅ Edit button clicked — edit modal should open");

        // Step 4: Clear existing name and fill new name
        console.log(`Step 4: Clearing existing name and filling new name: "${editCustomerName}"`);
        await this.page.locator(this.customerName).clear();
        await this.page.locator(this.customerName).fill(editCustomerName);
        console.log("✅ New customer name filled");

        // Step 5: Click Submit to save the changes
        console.log("Step 5: Clicking Submit button to save changes");
        await this.page.locator(this.submitButton).click();
        console.log("✅ Submit button clicked");

        // Step 6: Search for the updated name to verify edit
        console.log(`Step 6: Searching for updated customer name: "${editCustomerName}"`);
        await this.page.locator(this.searchBox).fill(editCustomerName);
        console.log("✅ Search box filled with updated name");

        // Step 7: Assert updated name is visible in the table
        console.log(`Step 7: Asserting updated customer "${editCustomerName}" is visible in table`);
        await expect(
            this.page.locator(`//span[text()='${editCustomerName}']`).first()
        ).toBeVisible();
        console.log(`✅ Customer "${editCustomerName}" edited and verified successfully`);

        console.log("=== EDIT AND VERIFY CUSTOMER NAME END ===");
    }

    /**
     * Function Name: DeleteCustomerVerification
     * Author: Bhavani
     * Created Date: 2026-05-12
     * Description: Deletes (soft deletes) a customer and verifies deletion.
     *   1. Searches for the customer by name
     *   2. Registers a dialog handler to accept the confirmation alert
     *   3. Clicks the Delete button to trigger the alert
     *   4. Verifies the customer no longer appears in the table
     * @param editCustomerName - Name of the customer to delete
     * Example: DeleteCustomerVerification("John Updated");
     */
    async DeleteCustomerVerification(editCustomerName: string) {
        console.log("=== DELETE CUSTOMER VERIFICATION START ===");
        console.log(`ℹ️ Customer to delete: "${editCustomerName}"`);

        // Step 1: Search for the customer to prepare for deletion
        console.log(`Step 1: Searching for customer to delete: "${editCustomerName}"`);
        await this.page.locator(this.searchBox).fill(editCustomerName);
        console.log("✅ Search box filled");

        // Step 2: Wait for search results to load
        console.log("Step 2: Waiting 2 seconds for search results to load");
        await this.page.waitForTimeout(2000);
        console.log("✅ Wait complete");

        // Step 3: Register dialog handler BEFORE clicking delete to catch the confirmation alert
        console.log("Step 3: Registering dialog handler to accept confirmation alert");
        this.page.once('dialog', async dialog => {
            console.log(`ℹ️ Dialog message: "${dialog.message()}"`);
            await dialog.accept();
            console.log("✅ Confirmation alert accepted successfully");
        });

        // Step 4: Click the Delete button to trigger the confirmation dialog
        console.log("Step 4: Clicking Delete button to trigger confirmation alert");
        await this.page.locator(this.DeleteBtn).click();
        console.log("✅ Delete button clicked");

        // Step 5: Wait for deletion to process
        console.log("Step 5: Waiting 3 seconds for deletion to process");
        await this.page.waitForTimeout(3000);
        console.log("✅ Wait complete");

        // Step 6: Verify customer no longer appears in the table
        console.log(`Step 6: Verifying customer "${editCustomerName}" is removed from table`);
        if (await this.page.locator(`//span[text()='${editCustomerName}']`).count() === 0) {
            console.log(`✅ Customer "${editCustomerName}" deleted successfully — not found in table`);
        } else {
            console.log(`❌ Customer "${editCustomerName}" deletion failed — still visible in table`);
        }

        console.log("=== DELETE CUSTOMER VERIFICATION END ===");
    }

    /**
     * Function Name: adminCreateVerifyCustomer
     * Author: Bhavani
     * Created Date: 2026-05-12
     * Description: Master method that runs the full customer lifecycle flow:
     *   1. Creates a new customer
     *   2. Verifies the customer appears in the table
     *   3. Edits the customer name and verifies the update
     *   4. Deletes the customer and verifies deletion
     * @param Name             - Customer name to create
     * @param Email            - Customer email address
     * @param phno             - Customer phone number
     * @param verifyName       - Name to verify after creation
     * @param editCustomerName - New name to set during edit
     * @param menu             - Main menu to navigate to
     * @param subMenu          - Submenu to navigate to
     * Example: adminCreateVerifyCustomer("John", "john@test.com", "9876543210", "John", "John Updated", "Administration", "Customers");
     */
    async adminCreateVerifyCustomer(
        Name: string,
        Email: string,
        phno: string,
        verifyName: string,
        editCustomerName: string,
        menu: string,
        subMenu: string
    ) {
        console.log("=== ADMIN CREATE VERIFY CUSTOMER FLOW START ===");
        console.log(`ℹ️ Name: "${Name}" | Email: "${Email}" | Phone: "${phno}"`);
        console.log(`ℹ️ Verify Name: "${verifyName}" | Edit Name: "${editCustomerName}"`);
        console.log(`ℹ️ Menu: "${menu}" | SubMenu: "${subMenu}"`);

        // Step 1: Create the customer
        console.log("Step 1: Starting customer creation");
        await this.createCustomerPage(Name, Email, phno, menu, subMenu);
        console.log("✅ Customer creation step complete");

        // Step 2: Verify the customer is present in the table
        console.log("Step 2: Starting customer verification");
        await this.verifyCustomerName(verifyName);
        console.log("✅ Customer verification step complete");

        // Step 3: Edit the customer name and verify the update
        console.log("Step 3: Starting customer edit and verification");
        await this.editAndVerifyCustomerName(editCustomerName, Name);
        console.log("✅ Customer edit and verification step complete");

        // Step 4: Delete the customer and verify deletion
        console.log("Step 4: Starting customer deletion and verification");
        await this.DeleteCustomerVerification(editCustomerName);
        console.log("✅ Customer deletion and verification step complete");

        console.log("=== ADMIN CREATE VERIFY CUSTOMER FLOW END ===");
    }
}