import { Page,expect } from "@playwright/test";
import { OutletMenuNav } from "../outletMenuNavigation";
export class OutletPage{
       /**
 * @dependency OutletMenuNav
 * @description Reusable navigation helper instance used to perform
 *              sidebar menu and submenu navigation across all page objects.
 *              Initialized once in the constructor and reused throughout the class.
 */
    outletMenuNav: OutletMenuNav;
    constructor(public page:Page){
        // ✅ Initialize reusable OutletMenuNav instance for sidebar navigation
        this.outletMenuNav = new OutletMenuNav(page);
    }
    // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet,Audit Management )
     homePageMenuItems='//a[contains(@class,"sidebar-link")]//span';

     // Submenu items under OutletManagement (Outlets)
     outletSubMenu='(//a/span[@class="lan-5"])[1]';

     //Outlet Management page header (used for validation)
     outletMngPage='//h1[text()="Outlet Management"]';

     //Search input field for outlet name
     searchByOutletNames='//input[@placeholder="Search by name, external id, or location..."]';

     //Created date filter dropdown
     filterDate='//select[@class="input-created-filter-type form-select"]';

     //All dropdown options under created date filter
     selectOptions='//select[@class="input-created-filter-type form-select"]/option';

     //Clear Filter
     clearFilter='(//button[@type="button"])[5]';

     //Outlet name link to click and navigate to outlet details
     outletNameText='//a[@class="outlet-name-text mb-1"]';

    // Outlet Information page header (used for validation)
    outletInformationText='//h1[text()="Outlet Information"]';

/**
 * Function Name: searchOutletName
 * Author: Lakshmi
 * Created Date: 2026-06-03
 *
 * Description:
 * This function performs end-to-end operations in the Outlet Management module:
 *
 * Navigation Steps:
 * 1. Navigates to the specified main menu (e.g., "Outlet Management")
 * 2. Clicks on the given sub menu (e.g., "Outlets")
 * 3. Validates successful navigation to the Outlet Management page
 *
 * Search Steps:
 * 4. Enters the given outlet name into the search input field
 * 5. Waits for search results to load dynamically
 *
 * Filter Steps:
 * 6. Opens the created date filter dropdown
 * 7. Reads all available filter options
 * 8. Matches and selects the required filter (e.g., "All time", "Today")
 * 9. Logs message if the filter is not found
 *
 * Validation & Action Steps:
 * 10. Fetches all outlet names displayed after search
 * 11. Checks if the searched outlet exists (case-insensitive comparison)
 * 12. If found:
 *     - Logs success message
 *     - Clicks on the matched outlet to navigate to details page
 * 13. If not found:
 *     - Logs "Outlet not found" message
 *
 * Parameters:
 * @param menu             - Main menu name (e.g., "Outlet Management")
 * @param subMenu          - Sub menu name (e.g., "Outlets")
 * @param searchOutletName - Outlet name to search
 * @param filter           - Filter value to select (e.g., "All time")
 *
 * Example Usage:
 * await searchOutletName(
 *   "Outlet Management",
 *   "Outlets",
 *   "Madhuloka liquor",
 *   "All time"
 * );
 *
 * Flow:
 * Navigate → Search → Apply Filter → Validate Result → Click (if found)
 */
    async searchOutletName(menu:string,subMenu:string,searchOutletName:string,filter:string){
    // Navigate to the target page using reusable OutletMenuNav helper
     await this.outletMenuNav.outletMenuAndSubMenu(menu, subMenu);
     
     await this.page.locator(this.searchByOutletNames).fill(searchOutletName);
        await this.page.locator(this.filterDate).click();
        const options = await this.page.locator(this.selectOptions).allTextContents();
        console.log(options);
        if (options.includes(filter)) {
        // ✅ Filter exists — select it
           await this.page.locator(this.filterDate).selectOption({ label: filter });
           console.log(`✅ Filter "${filter}" selected`);
        }else {
    // ❌ Filter not found — skip
    console.log(`Filter "${filter}" not found in dropdown. Skipping.`);
    return;
}
await this.page.locator(this.outletNameText).first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

        
// Get all outlet names after search
 const results = await this.page.locator(this.outletNameText).allTextContents();

// Check if searched outlet exists
const match = results.find(name =>name.trim().toLowerCase() === searchOutletName.trim().toLowerCase());
if (match) {
    console.log(`Outlet found: ${match}`);

    // Click exact matching outlet
    await this.page.locator(`//a[text()='${match}']`).click();

} else {
    console.log(`Outlet "${searchOutletName}" not found`);
}

}
}





