import { Page, expect } from "@playwright/test";

export class Home_Page {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    // Sidebar menu items (Home, Administration, Outlet Management, Product Management)
    homePageMenuItems = '//a[contains(@class,"sidebar-link")]//span';

    // Dashboard metric — Total Users count (h3 value following "Users" label)
    user = '//span[text()="Users"]/following::h3[1]';

    // Dashboard metric — Total Products count (h3 value following "Products" label)
    products = '(//span[text()="Products"]/following::h3[1])[2]';

    // Dashboard metric — Total Categories count (h3 value following "Categories" label)
    categories = '(//span[text()="Categories"]/following::h3[1])[2]';

    // Dashboard metric — Total Outlets count (h3 value following "Outlets" label)
    outlets = '(//span[text()="Outlets"]/following::h3[1])[2]';

    // SKU legend text values from the ApexCharts chart legend on the dashboard
    skus = '//span[@class="apexcharts-legend-text"]';

    // ==================== METHODS ====================

    /**
     * @function get_DashboardValues
     * @author Bhavani
     * @date 2026-05-08
     * @description Reads and prints all dashboard metric values and sidebar menu items.
     * Performs the following steps:
     *  1. Waits for sidebar menu items to load
     *  2. Reads and prints all sidebar menu item names
     *  3. Fetches and prints dashboard statistics:
     *     - Total Users
     *     - Total Products
     *     - Total Categories
     *     - Total Outlets
     *  4. Waits for SKU chart legend to load
     *  5. Fetches and prints all SKU legend values from the chart
     *
     * @returns {Promise<void>}
     * @example
     * const homePage = new Home_Page(page);
     * await homePage.get_DashboardValues();
     */
    async get_DashboardValues(): Promise<void> {
        console.log("=== GET DASHBOARD VALUES START ===");

        // -------------------- SIDEBAR MENU SECTION --------------------

        // Step 1: Wait for sidebar menu items to be visible before reading
        console.log("Step 1: Waiting for sidebar menu items to load");
        await this.page.waitForSelector(this.homePageMenuItems);
        console.log("✅ Sidebar menu items are visible");

        // Step 2: Fetch all sidebar menu item texts and print them
        console.log("Step 2: Fetching all sidebar menu item names");
        const lsMenuItems = await this.page.locator(this.homePageMenuItems).allTextContents();
        console.log(`ℹ️ Total menu items found: ${lsMenuItems.length}`);
        console.log("ℹ️ Sidebar Menu Items:");
        lsMenuItems.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.trim()}`);
        });
        console.log("✅ Sidebar menu items fetched successfully");

        // -------------------- DASHBOARD METRICS SECTION --------------------

        // Step 3: Fetch and print Total Users from dashboard
        console.log("\nStep 3: Fetching Total Users from dashboard");
        const totalUser = await this.page.locator(this.user).textContent();
        console.log(`✅ Total Users     : ${totalUser?.trim()}`);

        // Step 4: Fetch and print Total Products from dashboard
        console.log("Step 4: Fetching Total Products from dashboard");
        const totalProduct = await this.page.locator(this.products).textContent();
        console.log(`✅ Total Products  : ${totalProduct?.trim()}`);

        // Step 5: Fetch and print Total Categories from dashboard
        console.log("Step 5: Fetching Total Categories from dashboard");
        const totalCategories = await this.page.locator(this.categories).textContent();
        console.log(`✅ Total Categories: ${totalCategories?.trim()}`);

        // Step 6: Fetch and print Total Outlets from dashboard
        console.log("Step 6: Fetching Total Outlets from dashboard");
        const totalOutlets = await this.page.locator(this.outlets).textContent();
        console.log(`✅ Total Outlets   : ${totalOutlets?.trim()}`);

        // Print all dashboard metrics together as a summary
        console.log("\n📊 Dashboard Metrics Summary:");
        console.log(`   👤 Total Users      : ${totalUser?.trim()}`);
        console.log(`   📦 Total Products   : ${totalProduct?.trim()}`);
        console.log(`   🗂️  Total Categories : ${totalCategories?.trim()}`);
        console.log(`   🏪 Total Outlets    : ${totalOutlets?.trim()}`);

        // -------------------- SKU CHART LEGEND SECTION --------------------

        // Step 7: Wait for SKU chart legend values to be visible
        console.log("\nStep 7: Waiting for SKU chart legend to load");
        await this.page.waitForSelector(this.skus);
        const isSkuVisible = await this.page.locator(this.skus).first().isVisible();
        if (isSkuVisible) {
            console.log("✅ SKU chart legend is visible");
        } else {
            console.log("❌ SKU chart legend not visible — chart may still be loading");
        }

        // Step 8: Fetch all SKU legend text values from the chart
        console.log("Step 8: Fetching all SKU legend values from chart");
        const totalSkus = await this.page.locator(this.skus).allTextContents();
        console.log(`ℹ️ Total SKU legend items found: ${totalSkus.length}`);

        // Print each SKU legend value
        if (totalSkus.length === 0) {
            console.log("❌ No SKU legend values found — check chart selector");
        } else {
            console.log("📈 SKU Legend Values:");
            totalSkus.forEach((sku, index) => {
                console.log(`   ${index + 1}. ${sku.trim()}`);
            });
            console.log("✅ SKU legend values fetched successfully");
        }

        console.log("\n=== GET DASHBOARD VALUES END ===");
    }
    
}