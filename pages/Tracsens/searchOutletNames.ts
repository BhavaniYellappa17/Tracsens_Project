import { Page,expect } from "@playwright/test";
import { OutletMenuNav } from "../outletMenuNavigation";
export class OutletPage{
    outletMenuNav: OutletMenuNav;
    constructor(public page:Page){
        this.outletMenuNav = new OutletMenuNav(page);
    }
    // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet )
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

     //All outlet name
     outletNames='//a[@class="outlet-name-text mb-1"]';

     //External Id
     externalId='//div[@class="id-chip-modern text-truncate"]';

     //Created Date
     createdDate='(//div[@class="table-cell p-4"]//div[@class="address-snippet"])[position() mod 2 = 0]';

     //AuditsLink
     audits='(//span[@class="tab-label"])[2]';

     //AuditId
     auditId='//div[@class="sc-dYwGCk knNOUg rdt_TableRow"]';

      //View Button
     viewButton='//button[@title="View Audit Details"]';

     //NextButton
     nextButton='//span[text()="Next"]';
     //Close Button
     closeButton='//button[@aria-label="Close"]';

     //Reset All Filters
     restFilter='//button[@class="audit-reset-btn btn btn-secondary"]';

    //Filter by Category
     filterByCategory='//select[@id="categorySelect"]';

     //Categories
     categories='//select[@id="categorySelect"]/option';

     //Number of Racks
     racks='//div[@class="rack-thumbnail-wrapper"]';

     //RackNumber
     rackNumber='//div[@class="audit-rack-thumbnail-label rack-name-text"]';
     //By Brand
     brand='(//a[@style="cursor: pointer;"])[1]';
     //By SKUs
     skus='(//a[@style="cursor: pointer;"])[2]';

     //All Brands
     allBrands='//div[@class="d-flex justify-content-between align-items-center brand-card-header audit-brand-card-header card-header"]';
     //All SKUs
     allSKUs='//div[@class="d-flex align-items-start w-100 sku-item-content"]';

     //Export PDF Button
     exportPdf='//button[text()="Export PDF"]';

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
     await this.outletMenuNav.outletMenuAndSubMenu(menu, subMenu);
     await this.page.locator(this.searchByOutletNames).fill(searchOutletName);
        await this.page.locator(this.filterDate).click();
        const options = await this.page.locator(this.selectOptions).allTextContents();
        console.log(options);
        let filterFound  = false;
     // Loop through dropdown options to find matching filter
     for (const item of options) {
             if (item.trim() === filter) {
              try {
                    await this.page.locator(this.filterDate).selectOption({ label: filter });
                    console.log(`Filter "${item}" was successfully selected from the dropdown.`);
                    filterFound = true;
                    break;
    
                } catch (error) 
                {
                    console.log(`Error while clicking ${item}:`, error);
                }
       
           }
        }
// If filter not found
if (!filterFound) {
  console.log(`Filter "${filter}" not available in dropdown.`);
}

//await this.page.locator(this.outletNameText).click();
// Wait for search results to load
await this.page.waitForTimeout(2000); 

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





