import { Page, expect } from "@playwright/test";

export class AdminPage {

    constructor(public page: Page) {
        this.page = page;
    }

    // ==================== LOCATORS ====================

    // Sidebar main menu items (e.g., Home, Administration, Outlet Management, Product Management)
    homePageMenuItems = '//a[contains(@class,"sidebar-link")]//span';

    // Submenu items under any expanded main menu (e.g., Customers, Users under Administration)
    adminSubMenu = '//span[contains(@class,"lan-4")]';

    // ==================== METHODS ====================

    /**
     * Function Name: adminMenuAndSubMenus
     * Author: Lakshmi
     * Created Date: 2026-05-11
     * Description: Navigates through the sidebar by:
     *   1. Reading all main menu items from the sidebar
     *   2. Finding and clicking the given main menu (e.g., "Administration")
     *   3. Waiting for the submenu to expand
     *   4. Finding and clicking the given submenu item (e.g., "Customers")
     *   5. Logging success or failure at each step
     * @param menu     - Main menu name to click (e.g., "Administration")
     * @param sSubMenu - Submenu name to click (e.g., "Customers")
     * Example: adminMenuAndSubMenus('Administration', 'Customers');
     */
    async adminMenuAndSubMenus(menu: string, sSubMenu: string) {
        console.log("=== ADMIN MENU AND SUBMENU NAVIGATION START ===");
        console.log(`ℹ️ Target Menu: "${menu}" | Target SubMenu: "${sSubMenu}"`);

        // Flags to track whether menu and submenu were found and clicked
        let menuFound    = false;
        let subMenuFound = false;

        // -------------------- MAIN MENU SECTION --------------------

        // Step 1: Wait for sidebar menu items to be visible before reading them
        console.log("Step 1: Waiting for sidebar main menu items to be visible");
        await this.page.locator(this.homePageMenuItems).first().waitFor();
        console.log("✅ Sidebar menu items are visible");

        // Step 2: Read all main menu item texts from the sidebar
        console.log("Step 2: Reading all main menu item texts from sidebar");
        const texts = await this.page.locator(this.homePageMenuItems).allTextContents();
        console.log(`ℹ️ Available main menu items on page: [${texts.map(t => t.trim()).join(', ')}]`);

        // Step 3: Loop through menu items and click the matching one
        console.log(`Step 3: Searching for main menu item: "${menu}"`);
        for (const item of texts) {
            if (item.trim() === menu.trim()) {
                console.log(`ℹ️ Match found: "${item.trim()}" — attempting to click`);
                try {
                    await this.page.locator(`//span[text()='${item.trim()}']`).click();
                    console.log(`✅ Main menu "${item.trim()}" clicked successfully`);
                    menuFound = true;
                    break;
                } catch (error) {
                    console.log(`❌ Error while clicking main menu "${item.trim()}":`, error);
                }
            }
        }

        // Step 4: If main menu was not found, log and exit early
        if (!menuFound) {
            console.log(`❌ Main menu "${menu}" not found in sidebar — available items: [${texts.map(t => t.trim()).join(', ')}]`);
            console.log("=== ADMIN MENU AND SUBMENU NAVIGATION END (MENU NOT FOUND) ===");
            return;
        }

        // -------------------- SUBMENU SECTION --------------------

        // Step 5: Wait for submenu items to appear after clicking main menu
        console.log(`Step 5: Waiting for submenu items to appear after clicking "${menu}"`);
        await this.page.locator(this.adminSubMenu).first().waitFor({ state: 'visible' });
        console.log("✅ Submenu items are visible");

        // Step 6: Read all submenu item texts
        console.log("Step 6: Reading all submenu item texts");
        const subMenuTexts = await this.page.locator(this.adminSubMenu).allTextContents();
        console.log(`ℹ️ Available submenu items: [${subMenuTexts.map(t => t.trim()).join(', ')}]`);

        // Step 7: Loop through submenu items and click the matching one
        console.log(`Step 7: Searching for submenu item: "${sSubMenu}"`);
        for (const items of subMenuTexts) {
            if (items.trim() === sSubMenu.trim()) {
                console.log(`ℹ️ Match found: "${items.trim()}" — attempting to click`);
                try {
                    await this.page.locator(`//span[text()='${items.trim()}']`).click();
                    console.log(`✅ Submenu "${items.trim()}" clicked successfully`);
                    subMenuFound = true;
                    break;
                } catch (error) {
                    console.log(`❌ Error while clicking submenu "${items.trim()}":`, error);
                }
            }
        }

        // Step 8: If submenu was not found, log the failure
        if (!subMenuFound) {
            console.log(`❌ Submenu "${sSubMenu}" not found — available items: [${subMenuTexts.map(t => t.trim()).join(', ')}]`);
        }

        console.log("=== ADMIN MENU AND SUBMENU NAVIGATION END ===");
    }

    /**
     * Function Name: adminMenuSubmenu
     * Author: Lakshmi
     * Created Date: 2026-05-12
     * Description: Wrapper method that calls adminMenuAndSubMenus to navigate
     *   to the given main menu and submenu. Use this as the entry point for
     *   all menu navigation across test flows.
     * @param menu    - Main menu name to click (e.g., "Administration")
     * @param subMenu - Submenu name to click (e.g., "Customers")
     * Example: adminMenuSubmenu("Administration", "Customers");
     */
    async adminMenuSubmenu(menu: string, subMenu: string) {
        console.log("=== ADMIN MENU SUBMENU WRAPPER START ===");
        console.log(`ℹ️ Navigating to: "${menu}" > "${subMenu}"`);

        // Step 1: Delegate navigation to adminMenuAndSubMenus
        console.log("Step 1: Calling adminMenuAndSubMenus for navigation");
        await this.adminMenuAndSubMenus(menu, subMenu);
        console.log(`✅ Navigation to "${menu}" > "${subMenu}" complete`);

        console.log("=== ADMIN MENU SUBMENU WRAPPER END ===");
    }
}