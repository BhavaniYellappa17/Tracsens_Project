/**
 * @file adminTest.spec.ts
 * @author Bhavani
 * @date 2026-05-12
 * @description End-to-end test suite for Admin module covering:
 *  - Customer creation, edit, and deletion
 *  - User creation, edit, and deletion
 * Test data is driven from adminData.json to support multiple data sets.
 * Page Object Model (POM) pattern is used for all interactions.
 *
 * @testFile adminData.json - Contains array of customer and user test data records
 * @dependencies
 *  - AdminPage         → handles sidebar menu navigation
 *  - adminCustomerPage → handles customer CRUD operations
 *  - adminUserPage     → handles user CRUD operations
 *  - hooks/hooks       → handles login and logout before/after each test
 */

import { test } from '@playwright/test';
import '../../hooks/hooks';
import { AdminPage } from '../../pages/Tracsens/adminPage';
import { adminCustomerPage } from '../../pages/Tracsens/adminCustomerPage';
import adminData from '../testdata/adminData.json';
import { adminUserPage } from '../../pages/Tracsens/adminUserPage';

// ==================== PAGE OBJECT INSTANCES ====================

// AdminPage instance — handles sidebar menu and submenu navigation
let adminPage: AdminPage;

// adminCustomerPage instance — handles customer create, edit, delete flows
let adminCustomer: adminCustomerPage;

// adminUserPage instance — handles user create, edit, delete flows
let adminUser: adminUserPage;

// ==================== TEST SUITE ====================

/**
 * @test Customer Lifecycle — Create, Verify, Edit, Delete
 * @description Data-driven test that loops through all records in adminData.json
 * and performs the complete customer lifecycle for each record:
 *  1. Creates a new customer if they don't already exist
 *  2. Verifies the customer appears in the table
 *  3. Edits the customer name and verifies the update
 *  4. Deletes the customer and verifies deletion
 *
 * @param page - Playwright Page object injected by the test runner
 * @timeout 60000ms — set to handle multiple data records with navigation waits
 *
 * @example
 * // Run this test using:
 * npx playwright test adminTest.spec.ts --grep "Customer Lifecycle"
 */
test('Customer Lifecycle — Create, Verify, Edit, Delete', async ({ page }) => {

    // Set test timeout to 60 seconds to accommodate navigation and wait times
    test.setTimeout(60000);

    console.log("=== CUSTOMER TEST SUITE START ===");
    console.log(`ℹ️ Total data records to process: ${adminData.length}`);

    try {

        // -------------------- INITIALIZATION SECTION --------------------

        // Initialize adminCustomerPage POM instance with the current page
        console.log("Initializing Page Object Model instances");
        adminCustomer = new adminCustomerPage(page);
        console.log("✅ adminCustomerPage instance created");

        // -------------------- DATA-DRIVEN LOOP SECTION --------------------

        // Loop through each test data record from adminData.json
        // Each record contains customer details for one complete create/edit/delete flow
        console.log("\nStarting data-driven loop through adminData records");

        for (const data of adminData) {

            console.log("\n========================================");
            console.log(`ℹ️ Processing record for: "${data.customerName}"`);
            console.log(`ℹ️ Customer Name    : "${data.customerName}"`);
            console.log(`ℹ️ Customer Email   : "${data.customerEmail}"`);
            console.log(`ℹ️ Customer Phone   : "${data.customerPhone}"`);
            console.log(`ℹ️ Edit Customer    : "${data.editcustomerName}"`);
            console.log(`ℹ️ Menu             : "${data.menu}"`);
            console.log(`ℹ️ Customer SubMenu : "${data.customerSubMenu}"`);
            console.log("========================================");

            // Step 1: Run complete customer lifecycle flow
            // Creates customer → verifies → edits → deletes
            console.log(`\nStep 1: Running customer flow for: "${data.customerName}"`);
            await adminCustomer.adminCreateVerifyCustomer(
                data.customerName!,       // Customer name to create
                data.customerEmail!,      // Customer email address
                data.customerPhone!,      // Customer phone number
                data.customerVerifyName!, // Name to verify after creation
                data.editcustomerName!,   // New name to set during edit
                data.menu!,               // Top-level menu to navigate to
                data.customerSubMenu! 
                    // Submenu to navigate to
            );
            console.log(`✅ Customer flow complete for: "${data.customerName}"`);

            console.log(`\n✅ Record processing complete for: "${data.customerName}"`);
        }

        console.log("\n✅ All customer records processed successfully");

    } catch (error) {

        // -------------------- ERROR HANDLING SECTION --------------------

        // Catch and log any errors that occur during test execution
        // Using instanceof check to safely access error message property
        if (error instanceof Error) {
            console.log(`❌ Test failed with error: ${error.message}`);
            console.log(`❌ Stack trace: ${error.stack}`);
        } else {
            console.log(`❌ Test failed with unknown error: ${error}`);
        }
    }

    console.log("=== CUSTOMER TEST SUITE END ===");
});


/**
 * @test User Lifecycle — Create, Verify, Edit, Delete
 * @description Data-driven test that loops through all records in adminData.json
 * and performs the complete user lifecycle for each record:
 *  1. Creates a new user linked to the customer
 *  2. Verifies the user appears in the table
 *  3. Edits the user name and verifies the update
 *  4. Deletes the user and verifies deletion
 *
 * @param page - Playwright Page object injected by the test runner
 * @timeout 60000ms — set to handle multiple data records with navigation waits
 *
 * @example
 * // Run this test using:
 * npx playwright test adminTest.spec.ts --grep "User Lifecycle"
 */
test('User Lifecycle — Create, Verify, Edit, Delete', async ({ page }) => {

    // Set test timeout to 60 seconds to accommodate navigation and wait times
    test.setTimeout(60000);

    console.log("=== USER TEST SUITE START ===");
    console.log(`ℹ️ Total data records to process: ${adminData.length}`);

    try {

        // -------------------- INITIALIZATION SECTION --------------------

        // Initialize adminUserPage POM instance with the current page
        console.log("Initializing Page Object Model instances");
        adminUser = new adminUserPage(page);
        console.log("✅ adminUserPage instance created");

        // -------------------- DATA-DRIVEN LOOP SECTION --------------------

        // Loop through each test data record from adminData.json
        // Each record contains user details for one complete create/edit/delete flow
        console.log("\nStarting data-driven loop through adminData records");

        for (const data of adminData) {

            console.log("\n========================================");
            console.log(`ℹ️ Processing record for: "${data.userFullName}"`);
            console.log(`ℹ️ User Full Name   : "${data.userFullName}"`);
            console.log(`ℹ️ Username         : "${data.userName}"`);
            console.log(`ℹ️ User Email       : "${data.customerEmail}"`);
            console.log(`ℹ️ Edit User Name   : "${data.editUserName}"`);
            console.log(`ℹ️ Menu             : "${data.menu}"`);
            console.log(`ℹ️ User SubMenu     : "${data.UserSubMenu}"`);
            console.log("========================================");

            // Step 1: Run complete user lifecycle flow
            // Creates user → verifies → edits → deletes
            console.log(`\nStep 1: Running user flow for: "${data.userFullName}"`);
            await adminUser.adminCreateVerifyEditDeleteUser(
                data.userSearch!,      // Name to search before creating (duplicate check)
                data.userFullName!,    // Full name for the new user
                data.userName!,        // Username for the new user
                data.customerEmail!,   // Email address for the new user
                data.userPassword!,    // Password for the new user
                data.userVerifyName!,  // Name to verify after creation
                data.editUserName!,    // New name to set during edit
                data.menu!,            // Top-level menu to navigate to
                data.UserSubMenu!      // Submenu to navigate to
            );
            console.log(`✅ User flow complete for: "${data.userFullName}"`);

            console.log(`\n✅ Record processing complete for: "${data.userFullName}"`);
        }

        console.log("\n✅ All user records processed successfully");

    } catch (error) {

        // -------------------- ERROR HANDLING SECTION --------------------

        // Catch and log any errors that occur during test execution
        // Using instanceof check to safely access error message property
        if (error instanceof Error) {
            console.log(`❌ Test failed with error: ${error.message}`);
            console.log(`❌ Stack trace: ${error.stack}`);
        } else {
            console.log(`❌ Test failed with unknown error: ${error}`);
        }
    }

    console.log("=== USER TEST SUITE END ===");
});