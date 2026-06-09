# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: administration.spec.ts >> Positive - Admin Customer Tests >> Customer Lifecycle — Create, Verify, Edit, Delete
- Location: tests\tracsensTest\administration.spec.ts:40:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('//a[contains(@class,"sidebar-link")]//span').first() to be visible
    63 × locator resolved to hidden <span>Home</span>

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - generic [ref=e8]:
        - link "login" [ref=e9] [cursor=pointer]:
          - /url: /login#javascript
          - img "login" [ref=e10]
        - generic [ref=e11]:
          - heading "Welcome back" [level=2] [ref=e12]
          - paragraph [ref=e13]: Please enter your details to sign in.
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]: Username
          - textbox "Enter your username" [ref=e17] [cursor=pointer]
        - generic [ref=e18]:
          - generic [ref=e19]: Password
          - generic [ref=e20]:
            - textbox "••••••••" [ref=e21] [cursor=pointer]
            - img [ref=e23] [cursor=pointer]
        - button "Sign In" [ref=e27] [cursor=pointer]
    - paragraph [ref=e29]: © 2026 TracSens AI Monitoring. All rights reserved.
  - region "Notifications Alt+T"
```

# Test source

```ts
  1   | import { Page, expect } from "@playwright/test";
  2   | 
  3   | export class AdminPage {
  4   | 
  5   |     constructor(public page: Page) {
  6   |         this.page = page;
  7   |     }
  8   | 
  9   |     // ==================== LOCATORS ====================
  10  | 
  11  |     // Sidebar main menu items (e.g., Home, Administration, Outlet Management, Product Management)
  12  |     homePageMenuItems = '//a[contains(@class,"sidebar-link")]//span';
  13  | 
  14  |     // Submenu items under any expanded main menu (e.g., Customers, Users under Administration)
  15  |     // Scoped to class "lan-4" to avoid matching dashboard stat labels with same text
  16  |     adminSubMenu = '//span[contains(@class,"lan-4")]';
  17  | 
  18  |     // ==================== METHODS ====================
  19  | 
  20  |     /**
  21  |      * Function Name: adminMenuAndSubMenus
  22  |      * Author: Bhavani
  23  |      * Created Date: 2026-05-11
  24  |      * Description: Navigates through the sidebar by:
  25  |      *   1. Reading all main menu items from the sidebar
  26  |      *   2. Finding and clicking the given main menu (e.g., "Administration")
  27  |      *   3. Waiting for the submenu to expand
  28  |      *   4. Finding and clicking the given submenu item (e.g., "Customers")
  29  |      *   5. Logging success or failure at each step
  30  |      * @param menu     - Main menu name to click (e.g., "Administration")
  31  |      * @param sSubMenu - Submenu name to click (e.g., "Customers")
  32  |      * Example: adminMenuAndSubMenus('Administration', 'Customers');
  33  |      */
  34  |     async adminMenuAndSubMenus(menu: string, sSubMenu: string) {
  35  |         console.log("=== ADMIN MENU AND SUBMENU NAVIGATION START ===");
  36  |         console.log(`ℹ️ Target Menu: "${menu}" | Target SubMenu: "${sSubMenu}"`);
  37  | 
  38  |         // Flags to track whether menu and submenu were found and clicked
  39  |         let menuFound    = false;
  40  |         let subMenuFound = false;
  41  | 
  42  |         // -------------------- MAIN MENU SECTION --------------------
  43  | 
  44  |         // Step 1: Wait for sidebar menu items to be visible before reading them
  45  |         console.log("Step 1: Waiting for sidebar main menu items to be visible");
> 46  |         await this.page.locator(this.homePageMenuItems).first().waitFor();
      |                                                                 ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  47  |         console.log("✅ Sidebar menu items are visible");
  48  | 
  49  |         // Step 2: Read all main menu item texts from the sidebar
  50  |         console.log("Step 2: Reading all main menu item texts from sidebar");
  51  |         const texts = await this.page.locator(this.homePageMenuItems).allTextContents();
  52  |         console.log(`ℹ️ Available main menu items on page: [${texts.map(t => t.trim()).join(', ')}]`);
  53  | 
  54  |         // Step 3: Loop through menu items and click the matching one
  55  |         console.log(`Step 3: Searching for main menu item: "${menu}"`);
  56  |         for (const item of texts) {
  57  |             if (item.trim() === menu.trim()) {
  58  |                 console.log(`ℹ️ Match found: "${item.trim()}" — attempting to click`);
  59  |                 try {
  60  |                     await this.page.locator(`//a[contains(@class,"sidebar-link")]//span[text()='${item.trim()}']`).click();
  61  |                     console.log(`✅ Main menu "${item.trim()}" clicked successfully`);
  62  |                     menuFound = true;
  63  |                     break;
  64  |                 } catch (error) {
  65  |                     console.log(`❌ Error while clicking main menu "${item.trim()}":`, error);
  66  |                 }
  67  |             }
  68  |         }
  69  | 
  70  |         // Step 4: If main menu was not found, log and exit early
  71  |         if (!menuFound) {
  72  |             console.log(`❌ Main menu "${menu}" not found in sidebar — available items: [${texts.map(t => t.trim()).join(', ')}]`);
  73  |             console.log("=== ADMIN MENU AND SUBMENU NAVIGATION END (MENU NOT FOUND) ===");
  74  |             return;
  75  |         }
  76  | 
  77  |         // -------------------- SUBMENU SECTION --------------------
  78  | 
  79  |         // Step 5: Wait for submenu items to appear after clicking main menu
  80  |         console.log(`Step 5: Waiting for submenu items to appear after clicking "${menu}"`);
  81  |         await this.page.locator(this.adminSubMenu).first().waitFor({ state: 'visible' });
  82  |         console.log("✅ Submenu items are visible");
  83  | 
  84  |         // Step 6: Read all submenu item texts
  85  |         console.log("Step 6: Reading all submenu item texts");
  86  |         const subMenuTexts = await this.page.locator(this.adminSubMenu).allTextContents();
  87  |         console.log(`ℹ️ Available submenu items: [${subMenuTexts.map(t => t.trim()).join(', ')}]`);
  88  | 
  89  |         // Step 7: Loop through submenu items and click the matching one
  90  |         // ✅ XPath scoped to class "lan-4" to avoid strict mode violation
  91  |         // when dashboard stat labels have the same text as submenu items (e.g. "Users")
  92  |         console.log(`Step 7: Searching for submenu item: "${sSubMenu}"`);
  93  |         for (const items of subMenuTexts) {
  94  |             if (items.trim() === sSubMenu.trim()) {
  95  |                 console.log(`ℹ️ Match found: "${items.trim()}" — attempting to click`);
  96  |                 try {
  97  |                     await this.page.locator(`//span[contains(@class,'lan-4') and text()='${items.trim()}']`).click();
  98  |                     console.log(`✅ Submenu "${items.trim()}" clicked successfully`);
  99  |                     subMenuFound = true;
  100 |                     break;
  101 |                 } catch (error) {
  102 |                     console.log(`❌ Error while clicking submenu "${items.trim()}":`, error);
  103 |                 }
  104 |             }
  105 |         }
  106 | 
  107 |         // Step 8: If submenu was not found, log the failure
  108 |         if (!subMenuFound) {
  109 |             console.log(`❌ Submenu "${sSubMenu}" not found — available items: [${subMenuTexts.map(t => t.trim()).join(', ')}]`);
  110 |         }
  111 | 
  112 |         console.log("=== ADMIN MENU AND SUBMENU NAVIGATION END ===");
  113 |     }
  114 | 
  115 |     /**
  116 |      * Function Name: adminMenuSubmenu
  117 |      * Author: Bhavani
  118 |      * Created Date: 2026-05-12
  119 |      * Description: Wrapper method that calls adminMenuAndSubMenus to navigate
  120 |      *   to the given main menu and submenu. Use this as the entry point for
  121 |      *   all menu navigation across test flows.
  122 |      * @param menu    - Main menu name to click (e.g., "Administration")
  123 |      * @param subMenu - Submenu name to click (e.g., "Customers")
  124 |      * Example: adminMenuSubmenu("Administration", "Customers");
  125 |      */
  126 |     async adminMenuSubmenu(menu: string, subMenu: string) {
  127 |         console.log("=== ADMIN MENU SUBMENU WRAPPER START ===");
  128 |         console.log(`ℹ️ Navigating to: "${menu}" > "${subMenu}"`);
  129 | 
  130 |         // Step 1: Delegate navigation to adminMenuAndSubMenus
  131 |         console.log("Step 1: Calling adminMenuAndSubMenus for navigation");
  132 |         await this.adminMenuAndSubMenus(menu, subMenu);
  133 |         console.log(`✅ Navigation to "${menu}" > "${subMenu}" complete`);
  134 | 
  135 |         console.log("=== ADMIN MENU SUBMENU WRAPPER END ===");
  136 |     }
  137 | }
```