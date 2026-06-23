import { Page, expect } from "@playwright/test";

export class Home_Page {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    homePageMenuItems = '//a[contains(@class,"sidebar-link")]//span';
    user = '//span[text()="Users"]/following::h3[1]';
    products = '(//span[text()="Products"]/following::h3[1])[2]';
    categories = '(//span[text()="Categories"]/following::h3[1])[2]';
    outlets = '(//span[text()="Outlets"]/following::h3[1])[2]';
    skus = '//span[@class="apexcharts-legend-text"]';

    // ==================== METHODS ====================

    async getSidebarMenuItems(): Promise<string[]> {
        console.log("=== GET SIDEBAR MENU ITEMS START ===");
        await this.page.waitForSelector(this.homePageMenuItems);
        const lsMenuItems = await this.page.locator(this.homePageMenuItems).allTextContents();
        console.log(`ℹ️ Total menu items found: ${lsMenuItems.length}`);
        lsMenuItems.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.trim()}`);
        });
        console.log("=== GET SIDEBAR MENU ITEMS END ===");
        return lsMenuItems;
    }

    async getTotalUsers(): Promise<string> {
        console.log("=== GET TOTAL USERS START ===");
        const totalUser = await this.page.locator(this.user).textContent();
        console.log(`✅ Total Users: ${totalUser?.trim()}`);
        console.log("=== GET TOTAL USERS END ===");
        return totalUser?.trim() ?? '';
    }

    async getTotalProducts(): Promise<string> {
        console.log("=== GET TOTAL PRODUCTS START ===");
        const totalProduct = await this.page.locator(this.products).textContent();
        console.log(`✅ Total Products: ${totalProduct?.trim()}`);
        console.log("=== GET TOTAL PRODUCTS END ===");
        return totalProduct?.trim() ?? '';
    }

    async getTotalCategories(): Promise<string> {
        console.log("=== GET TOTAL CATEGORIES START ===");
        const totalCategories = await this.page.locator(this.categories).textContent();
        console.log(`✅ Total Categories: ${totalCategories?.trim()}`);
        console.log("=== GET TOTAL CATEGORIES END ===");
        return totalCategories?.trim() ?? '';
    }

    async getTotalOutlets(): Promise<string> {
        console.log("=== GET TOTAL OUTLETS START ===");
        const totalOutlets = await this.page.locator(this.outlets).textContent();
        console.log(`✅ Total Outlets: ${totalOutlets?.trim()}`);
        console.log("=== GET TOTAL OUTLETS END ===");
        return totalOutlets?.trim() ?? '';
    }

    async getSkuLegendValues(): Promise<string[]> {
        console.log("=== GET SKU LEGEND VALUES START ===");
        await this.page.waitForSelector(this.skus);
        const totalSkus = await this.page.locator(this.skus).allTextContents();
        console.log(`ℹ️ Total SKU legend items found: ${totalSkus.length}`);
        totalSkus.forEach((sku, index) => {
            console.log(`   ${index + 1}. ${sku.trim()}`);
        });
        console.log("=== GET SKU LEGEND VALUES END ===");
        return totalSkus;
    }

    // Keep original combined method if needed elsewhere
    async get_DashboardValues(): Promise<void> {
        await this.getSidebarMenuItems();
        await this.getTotalUsers();
        await this.getTotalProducts();
        await this.getTotalCategories();
        await this.getTotalOutlets();
        await this.getSkuLegendValues();
    }
}