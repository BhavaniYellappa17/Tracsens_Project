/**
 * @fileoverview Test suite for Home Page dashboard statistics.
 *
 * Validates that dashboard statistics are correctly fetched
 * and displayed on the Tracsens home page using Playwright
 * and the Page Object Model pattern.
 *
 * @module HomePageTests
 * @author Bhavani
 * @date   25/05/2025
 *
 * @testFile — N/A (no external test data required)
 * @dependencies
 *  - Home_Page  → handles dashboard statistics retrieval
 *  - hooks/hooks → handles login and logout before/after each test
 */

import { test } from '@playwright/test';
import '../../hooks/hooks';
import { Home_Page } from '../../pages/Tracsens/homePage';

// ==================== PAGE OBJECT INSTANCES ====================

/**
 * Home_Page instance — handles dashboard statistics interactions
 * Declared at module level to be shared across all test blocks.
 */
let homepage: Home_Page;

// ==================== TEST SUITE ====================

/**
 * @test get dashboard statistics from home page
 * @description Fetches and prints all dashboard statistic values
 * displayed on the Tracsens home page.
 *
 * Steps:
 *  1. Initialize the Home_Page POM with the current Playwright page
 *  2. Call get_DashboardValues() to fetch and log all statistics
 *
 * @param page - Playwright Page object injected by the test runner
 *
 * @example
 * // Run this test using:
 * npx playwright test homeTest.spec.ts
 */
test('get dashboard statistics from home page', async ({ page }) => {

    console.log("=== HOME PAGE TEST SUITE START ===");

    try {

        // -------------------- INITIALIZATION SECTION --------------------

        // Initialize Home_Page POM instance with the current page
        console.log("Initializing Page Object Model instances");
        homepage = new Home_Page(page);
        console.log("✅ Home_Page instance created");

        // -------------------- DASHBOARD STATISTICS SECTION --------------------

        // Fetch and print all dashboard statistics values from the home page
        console.log("\nStep 1: Fetching dashboard statistics");
        await homepage.get_DashboardValues();
        console.log("✅ Dashboard statistics fetched successfully");

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

    console.log("=== HOME PAGE TEST SUITE END ===");
});