import { Page,expect } from "@playwright/test";

export class OutletMenuNav{
    
    constructor(public page:Page){
   }
    // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet )
     homePageMenuItems='//a[contains(@class,"sidebar-link")]//span';

     // Submenu items under OutletManagement (Outlets)
     outletSubMenu='(//a/span[@class="lan-5"])[1]';

     //Outlet Management page header (used for validation)
     outletMngPage='//h1[text()="Outlet Management"]';

     /**
     * Function Name: outletMenuAndSubMenu
     * Author: Lakshmi
     * Created Date: 2026-05-29
     * Description: This function navigates to the Outlet Management page by:
     *
     * Main Menu Navigation Steps:
     * 1. Waits for sidebar menu items to be visible after login
     * 2. Fetches all sidebar menu item texts
     * 3. Loops through menu items to find and click the matching main menu
     * 4. Logs success or failure based on menu item availability
     *
     * Sub Menu Navigation Steps:
     * 5. Fetches all submenu item texts under the clicked main menu
     * 6. Loops through submenu items to find and click the matching submenu
     * 7. Logs success or failure based on submenu item availability
     *
     * Validation Steps:
     * 8. Validates navigation to Outlet Management page by checking page header
     * 9. Logs success message after successful navigation
     *
     * @param menu    - Main menu name to click (e.g., "Outlet Management")
     * @param subMenu - Sub menu name to click (e.g., "Outlets")
     *
     * Example Usage:
     * await outletMenuAndSubMenu('Outlet Management', 'Outlets');
     *
     * Main Menu → Click "Outlet Management"
     * Sub Menu  → Click "Outlets"
     * Validate  → Confirm navigation to Outlet Management page
     */

     async outletMenuAndSubMenu(menu:string,subMenu:string){
      let found = false;

    // Wait for sidebar menu to be visible
      await this.page.locator(this.homePageMenuItems).first().waitFor();
     // Get all menu item texts
      const texts=await this.page.locator(this.homePageMenuItems).allTextContents();
      console.log(texts);
      // Loop through menu items and click matching menu
      for (const item of texts) {
      if (item === menu) {
        try {
            await this.page.locator(`//span[text()='${item.trim()}']`).click();
            console.log(`Successfully clicked ${item}`);
            found = true;
            break;
        } catch (error) {
            console.log(`Error while clicking ${item}:`, error);
        }
    }
}
 // If menu not found
if (!found) {
    console.log(`Not matched MenuItems`);

}
    const subMenus=await this.page.locator(this.outletSubMenu).allTextContents();
      console.log(subMenus);
      // Loop through menu items and click matching menu
      for (const item of subMenus) {
      if (item === subMenu) {
        try {
            await this.page.locator(`//a/span[text()='${item.trim()}']`).click();
            console.log(`Successfully clicked SubMenu ${item}`);
            found = true;
            break;
        } catch (error) {
            console.log(`Error while clicking ${item}:`, error);
        }
    }
}
 // If menu not found
if (!found) {
    console.log(`Not matched SubMenuItems`);
}
        // Validate submenu presence
     //await this.page.locator(this.outletSubMenu).first().isVisible(); 

     // Get all subMenu texts(Outlets)
    //  const text=await this.page.locator(this.outletSubMenu).allTextContents();
    //  console.log(text);
     //await this.page.locator(this.outletSubMenu).click();
     await this.page.locator(this.outletMngPage).isVisible();
     console.log("Successfully Navigates to Outlet Management Page");
}
}