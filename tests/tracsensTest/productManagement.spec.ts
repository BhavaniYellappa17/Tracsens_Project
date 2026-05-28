/**
 * @fileoverview Test suite for Product Management module.
 *
 * Covers the following test scenarios:
 *  - Fetching all product names and SKUs from the product list
 *  - Creating, editing, and deleting products (data-driven)
 *  - Fetching all product category names
 *
 * @module ProductManagementTests
 * @author
 * @date
 *
 * @testFile productData.json - Contains array of product test data records
 * @dependencies
 *  - productList           → handles fetching all product names and SKUs
 *  - productCategory       → handles fetching all product category names
 *  - productManagement     → handles product create, edit, delete flows
 *  - hooks/hooks           → handles login and logout before/after each test
 */

import { test } from '@playwright/test';
import '../../hooks/hooks';
import { productList } from '../../pages/Tracsens/FetchProductNames';
import { productCategory } from '../../pages/Tracsens/productCategory';
import { productManagement } from '../../pages/Tracsens/createVerifyEditDeleteProduct';
import productData from '../testdata/productData.json';

// ==================== PAGE OBJECT INSTANCES ====================

// productManagement instance — handles product create, edit, delete flows
let productPage: productManagement;

// productCategory instance — handles fetching all product category names
let FetchproductCategory: productCategory;

// productList instance — handles fetching all product names and SKUs
let FetchProductNames: productList;

// ==================== TEST SUITE ====================

/**
 * @test Fetch ProductList
 * @description Fetches and logs all product names and their associated SKUs
 * from the Tracsens product list page.
 *
 * Steps:
 *  1. Initialize the productList POM with the current Playwright page
 *  2. Call getAllProductNamesAndSKUs() to retrieve and log all products
 *
 * @param page - Playwright Page object injected by the test runner
 * @timeout 600000ms — extended timeout to handle large product lists
 *
 * @example
 * // Run this test using:
 * npx playwright test productTest.spec.ts --grep "Fetch ProductList"
 */
test('Fetch ProductList', async ({ page }) => {

    // Set test timeout to 10 minutes to handle large product data sets
    test.setTimeout(600000);

    console.log("=== FETCH PRODUCT LIST TEST START ===");

    try {

        // -------------------- INITIALIZATION SECTION --------------------

        // Initialize productList POM instance with the current page
        console.log("Initializing Page Object Model instances");
        FetchProductNames = new productList(page);
        console.log("✅ productList instance created");

        // -------------------- FETCH PRODUCT LIST SECTION --------------------

        // Fetch and log all product names and SKUs from the product list page
        console.log("\nStep 1: Fetching all product names and SKUs");
        await FetchProductNames.getAllProductNamesAndSKUs();
        console.log("✅ All product names and SKUs fetched successfully");

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

    console.log("=== FETCH PRODUCT LIST TEST END ===");
});


/**
 * @test createProduct
 * @description Data-driven test that loops through all records in productData.json
 * and performs the following for each record:
 *  1. Creates a new product with the provided details
 *  2. Verifies the product appears in the product list
 *  3. Edits the product name and verifies the update
 *  4. Deletes the product and verifies deletion
 *
 * @param page - Playwright Page object injected by the test runner
 * @timeout 180000ms — set to handle multiple data records with navigation waits
 *
 * @example
 * // Run this test using:
 * npx playwright test productTest.spec.ts --grep "createProduct"
 */
test('createProduct', async ({ page }) => {

    // Set test timeout to 3 minutes to accommodate navigation and wait times
    test.setTimeout(180000);

    console.log("=== CREATE PRODUCT TEST SUITE START ===");
    console.log(`ℹ️ Total data records to process: ${productData.length}`);

    try {

        // -------------------- INITIALIZATION SECTION --------------------

        // Initialize productManagement POM instance with the current page
        console.log("Initializing Page Object Model instances");
        productPage = new productManagement(page);
        console.log("✅ productManagement instance created");

        // -------------------- DATA-DRIVEN LOOP SECTION --------------------

        // Loop through each test data record from productData.json
        // Each record contains product details for one complete create/edit/delete flow
        console.log("\nStarting data-driven loop through productData records");

        for (const data of productData) {

            console.log("\n========================================");
            console.log(`ℹ️ Processing record for: "${data.sproductName}"`);
            console.log(`ℹ️ Product Name         : "${data.sproductName}"`);
            console.log(`ℹ️ Detailed Description : "${data.sdetailedDescription}"`);
            console.log(`ℹ️ SKU                  : "${data.sstockKeepingUnit}"`);
            console.log(`ℹ️ Standard Price       : "${data.sstandardPrice}"`);
            console.log(`ℹ️ Edit Product Name    : "${data.editProdName}"`);
            console.log(`ℹ️ Menu                 : "${data.menu}"`);
            console.log(`ℹ️ Product SubMenu      : "${data.ProductSubMenu}"`);
            console.log("========================================");

            // Step 1: Run complete product lifecycle flow
            // Creates product → verifies → edits → deletes
            console.log(`\nStep 1: Running product flow for: "${data.sproductName}"`);
            await productPage.createEditDeleteProduct(
                data.sproductName,         // Product name to create
                data.sdetailedDescription, // Detailed description of the product
                data.sstockKeepingUnit,    // Stock Keeping Unit (SKU) identifier
                data.sstandardPrice,       // Standard price of the product
                data.editProdName,         // New name to set during edit
                data.menu,                 // Top-level menu to navigate to
                data.ProductSubMenu        // Submenu to navigate to
            );
            console.log(`✅ Product flow complete for: "${data.sproductName}"`);

            console.log(`\n✅ Record processing complete for: "${data.sproductName}"`);
        }

        console.log("\n✅ All product data records processed successfully");

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

    console.log("=== CREATE PRODUCT TEST SUITE END ===");
});


/**
 * @test Fetch CategoryName
 * @description Fetches and logs all product category names
 * from the Tracsens product category page.
 *
 * Steps:
 *  1. Initialize the productCategory POM with the current Playwright page
 *  2. Call getAllCategoryNames() to retrieve and log all category names
 *
 * @param page - Playwright Page object injected by the test runner
 * @timeout 180000ms — set to handle navigation and page load waits
 *
 * @example
 * // Run this test using:
 * npx playwright test productTest.spec.ts --grep "Fetch CategoryName"
 */
test('Fetch CategoryName', async ({ page }) => {

    // Set test timeout to 3 minutes to handle navigation and page load waits
    test.setTimeout(180000);

    console.log("=== FETCH CATEGORY NAME TEST START ===");

    try {

        // -------------------- INITIALIZATION SECTION --------------------

        // Initialize productCategory POM instance with the current page
        console.log("Initializing Page Object Model instances");
        FetchproductCategory = new productCategory(page);
        console.log("✅ productCategory instance created");

        // -------------------- FETCH CATEGORY NAMES SECTION --------------------

        // Fetch and log all product category names from the category page
        console.log("\nStep 1: Fetching all product category names");
        await FetchproductCategory.getAllCategoryNames();
        console.log("✅ All product category names fetched successfully");

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

    console.log("=== FETCH CATEGORY NAME TEST END ===");
});