/**
 * @fileoverview Home Page Test Suite for Tracsens Application
 * @description This test suite validates the dashboard statistics displayed on the Home Page,
 *              including sidebar menu items, total users, products, categories, outlets, and SKU legends.
 * @module tests/Tracsens/homePage
 */

import { test, expect } from '@playwright/test';
import '../../hooks/hooks';
import { Home_Page } from '../../pages/Tracsens/homePage';

/** @type {Home_Page} Page Object Model instance for the Home Page */
let homepage: Home_Page;

/**
 * @test {get dashboard statistics from home page}
 * @description Validates all key dashboard statistics on the Tracsens Home Page.
 *
 * This test covers the following assertions:
 * 1. Sidebar menu items are visible and count is greater than 0
 * 2. Total Users stat is visible and contains a valid numeric value
 * 3. Total Products stat is visible and contains a valid numeric value
 * 4. Total Categories stat is visible and contains a valid numeric value
 * 5. Total Outlets stat is visible and contains a valid numeric value
 * 6. SKU chart legend items are visible and non-empty
 *
 * @param {object} page - Playwright Page instance injected by the test runner
 *
 * @example
 * // Run this specific test
 * npx playwright test homePage.spec.ts
 */
test('get dashboard statistics from home page', async ({ page }) => {

    console.log("=== HOME PAGE TEST SUITE START ===");

    try {

        // ============================================================
        // INITIALIZATION
        // Instantiate the Page Object Model for the Home Page.
        // All locators and helper methods are encapsulated in Home_Page.
        // ============================================================

        console.log("Initializing Page Object Model instances");
        homepage = new Home_Page(page);
        console.log("✅ Home_Page instance created");

        // ============================================================
        // STEP 1: Sidebar Menu Items
        // Verifies that the sidebar navigation is rendered and contains
        // at least one menu item, ensuring navigation is functional.
        // ============================================================

        /**
         * @type {string[]} menuItems - Array of sidebar menu item texts
         */
        const menuItems = await homepage.getSidebarMenuItems();

        // Assert: At least the first menu item is visible in the DOM
        await expect(page.locator(homepage.homePageMenuItems).first()).toBeVisible();

        // Assert: Menu items array is non-empty (navigation is populated)
        expect(menuItems.length).toBeGreaterThan(0);
        console.log(`✅ Assert passed: ${menuItems.length} sidebar menu items visible`);

        // ============================================================
        // STEP 2: Total Users
        // Verifies the "Total Users" statistic card is visible and
        // displays a valid integer or comma-formatted number (e.g. 1,200).
        // ============================================================

        /**
         * @type {string} totalUsers - The text content of the Total Users stat
         */
        const totalUsers = await homepage.getTotalUsers();

        // Assert: The Total Users locator is visible on the page
        await expect(page.locator(homepage.user)).toBeVisible();

        // Assert: Value matches numeric pattern (digits and commas only)
        expect(totalUsers).toMatch(/^[\d,]+$/);
        console.log(`✅ Assert passed: Total Users = "${totalUsers}"`);

        // ============================================================
        // STEP 3: Total Products
        // Verifies the "Total Products" statistic card is visible and
        // displays a valid numeric value.
        // ============================================================

        /**
         * @type {string} totalProducts - The text content of the Total Products stat
         */
        const totalProducts = await homepage.getTotalProducts();

        // Assert: The Total Products locator is visible on the page
        await expect(page.locator(homepage.products)).toBeVisible();

        // Assert: Value matches numeric pattern (digits and commas only)
        expect(totalProducts).toMatch(/^[\d,]+$/);
        console.log(`✅ Assert passed: Total Products = "${totalProducts}"`);

        // ============================================================
        // STEP 4: Total Categories
        // Verifies the "Total Categories" statistic card is visible and
        // displays a valid numeric value.
        // ============================================================

        /**
         * @type {string} totalCategories - The text content of the Total Categories stat
         */
        const totalCategories = await homepage.getTotalCategories();

        // Assert: The Total Categories locator is visible on the page
        await expect(page.locator(homepage.categories)).toBeVisible();

        // Assert: Value matches numeric pattern (digits and commas only)
        expect(totalCategories).toMatch(/^[\d,]+$/);
        console.log(`✅ Assert passed: Total Categories = "${totalCategories}"`);

        // ============================================================
        // STEP 5: Total Outlets
        // Verifies the "Total Outlets" statistic card is visible and
        // displays a valid numeric value.
        // ============================================================

        /**
         * @type {string} totalOutlets - The text content of the Total Outlets stat
         */
        const totalOutlets = await homepage.getTotalOutlets();

        // Assert: The Total Outlets locator is visible on the page
        await expect(page.locator(homepage.outlets)).toBeVisible();

        // Assert: Value matches numeric pattern (digits and commas only)
        expect(totalOutlets).toMatch(/^[\d,]+$/);
        console.log(`✅ Assert passed: Total Outlets = "${totalOutlets}"`);

        // ============================================================
        // STEP 6: SKU Legend Values
        // Verifies the SKU chart legend section is rendered with at least
        // one non-empty label, confirming the chart data is loaded.
        // ============================================================

        /**
         * @type {string[]} skuItems - Array of SKU legend label texts from the chart
         */
        const skuItems = await homepage.getSkuLegendValues();

        // Assert: The first SKU legend item is visible in the DOM
        await expect(page.locator(homepage.skus).first()).toBeVisible();

        // Assert: At least one SKU legend item exists
        expect(skuItems.length).toBeGreaterThan(0);

        // Assert: Each SKU legend item is a non-empty string (no blank labels)
        skuItems.forEach((sku, index) => {
            expect(sku.trim()).not.toBe('');
            console.log(`✅ Assert passed: SKU item ${index + 1} = "${sku.trim()}"`);
        });

    } catch (error) {

        // ============================================================
        // ERROR HANDLING
        // Catches any assertion or runtime error, logs a detailed message
        // with stack trace for debugging, then re-throws to fail the test.
        // ============================================================

        if (error instanceof Error) {
            // Known Error instance: log message and stack trace
            console.log(`❌ Test failed with error: ${error.message}`);
            console.log(`❌ Stack trace: ${error.stack}`);
        } else {
            // Unknown error type (e.g. thrown string or object)
            console.log(`❌ Test failed with unknown error: ${error}`);
        }

        // Re-throw so Playwright marks the test as FAILED
        throw error;
    }

    console.log("=== HOME PAGE TEST SUITE END ===");
});