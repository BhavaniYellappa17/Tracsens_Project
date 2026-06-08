import { Page,expect } from "@playwright/test";
/**
 * @class AuditMenuNav
 * @description Handles navigation to the Audit Management section
 *              via the sidebar menu and submenu in the Tracsens application.
 * @author Lakshmi
 * @date 2026-06-04
 */
export class AuditMenuNav{
    
    constructor(public page:Page){
   }
    // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet,Audit Management )
     homePageMenuItems='//a[contains(@class,"sidebar-link")]//span';

     // Submenu items under AuditManagement (Audits)
     auditSubMenu='//span[@class="lan-4"]';

     //Audit Management page header (used for validation)
     auditMngPage='//h1[text()="Audit Management"]';

    /**
     * @function auditMenuAndSubMenu
     * @author Lakshmi
     * @date 2026-06-04
     *
     * @description Navigates to the Audit Management page by:
     *
     * Validation:
     *   - Validates that menu and subMenu parameters are not empty before proceeding
     *
     * Main Menu Navigation:
     *   1. Waits for sidebar menu items to be visible after login
     *   2. Fetches all sidebar menu item texts
     *   3. Checks if the submenu is already expanded (avoids re-clicking)
     *   4. Loops through menu items to find and click the matching main menu
     *   5. Logs success or failure based on menu item availability
     *
     * Sub Menu Navigation:
     *   6. Fetches all submenu item texts under the clicked main menu
     *   7. Loops through submenu items to find and click the matching submenu
     *   8. Logs success or failure based on submenu item availability
     *
     * Page Validation:
     *   9. Validates navigation by checking Audit Management page header visibility
     *   10. Logs success message after successful navigation
     *
     * @param {string} menu    - Main menu name to click (e.g., "Audit Management")
     * @param {string} subMenu - Sub menu name to click (e.g., "Audits")
     * 
     *
     * @example
     * await auditMenuNav.auditMenuAndSubMenu('Audit Management', 'Audits');
     */

     async auditMenuAndSubMenu(menu:string,subMenu:string){
    //Validate menu input
      if (!menu?.trim()) {
      console.log("❌ Menu name is empty");
      return;
    }

    if (!subMenu?.trim()) {
      console.log("❌ SubMenu name is empty");
      return;
    }
      let menuFound = false;

    // Wait for sidebar menu to be visible
      await this.page.locator(this.homePageMenuItems).first().waitFor();
     // Get all menu item texts
      const texts=await this.page.locator(this.homePageMenuItems).allTextContents();
      console.log(texts);
      //Check if submenu already visible
     const isSubMenuVisible = await this.page.locator(`//span[text()='${subMenu}']`).isVisible().catch(() => false);
      // Loop through menu items and click matching menu
      if (!isSubMenuVisible) {
      for (const item of texts) {
      if (item === menu) {
        try {
            
            await this.page.locator(`//span[text()='${item.trim()}']`).click();
            console.log(`Successfully clicked ${item}`);
            menuFound = true;
            break;
        } catch (error) {
            console.log(`Error while clicking ${item}:`, error);
        }
    }
}
      }
      else {
             console.log("Menu already expanded, skipping click");
             menuFound = true;
}
 // If menu not found
if (!menuFound) {
    console.log(`❌ Menu "${menu}" not found`);
    return;
}
    const subMenus=await this.page.locator(this.auditSubMenu).allTextContents();
      console.log(subMenus);
       let subMenuFound = false;
      // Loop through menu items and click matching menu
      for (const item of subMenus) {
      if (item === subMenu) {
        try {
            
            await this.page.locator(`//span[text()='${item.trim()}']`).click();
            console.log(`Successfully clicked SubMenu ${item}`);
            subMenuFound = true;
            break;
        } catch (error) {
            console.log(`Error while clicking ${item}:`, error);
        }
    }
}
 // If menu not found
if (!subMenuFound) {
    console.log(`❌ SubMenu "${subMenu}" not found`);
    return;
  
}
     await this.page.locator(this.auditMngPage).isVisible();
     console.log("Successfully Navigates to Audit Management Page");
}
}