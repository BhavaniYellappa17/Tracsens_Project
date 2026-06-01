import { Page,expect } from "@playwright/test";
//import { AdminPage } from "./adminPage";

export class OutletPage{
        //adminPage: AdminPage;  
    constructor(public page:Page){
        //this.page = page;
        //this.adminPage = new AdminPage(this.page)
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
     * Function Name: outletMenuAndSubMenu
     * Author: Lakshmi
     * Created Date: 2026-05-25
     * Description: This function navigates through the sidebar menu by:
     * 1. Waiting for sidebar menu to be visible
     * 2. Finding the given main menu (e.g., "Outlet Management")
     * 3. Clicking on it if found
     * 4. Logs success or failure based on availability
     *
     * This function navigates through the Outlet Management sub menu by:
     * 1. Reading all available sub menu items under the selected main menu
     * 2. Finding the given sub menu item (e.g., "Outlets")
     * 3. Clicking on it if found
     * 4. Validates navigation to Outlet Management page
     *
     * This function collects all outlet data from all pages by:
     * 1. Collecting all outlet names from current page
     * 2. Collecting all external IDs from current page
     * 3. Collecting all created dates from current page
     * 4. Checking if next button is disabled
     * 5. If not disabled clicks next page and repeats
     * 6. If disabled stops and prints all collected data
     *
     * This function also performs search and filter operations by:
     * 1. Searching the given outlet name in collected data
     * 2. If found fills the search box with outlet name
     * 3. Selecting the required filter from the dropdown (e.g., "Today", "All time")
     * 4. Clicking the outlet name to navigate to outlet details
     * 5. If not found logs outlet not found message
     *
     * Parameters:
     * @param menu             - Main menu name to be clicked (e.g., "Outlet Management")
     * @param subMenu          - Sub menu name to be clicked (e.g., "Outlets")
     * @param searchOutletName - Outlet name to search (e.g., "Madhuloka liquor")
     * @param filter           - Filter value to select (e.g., "Today")
     *
     * Example Usage:
     * outletMenuAndSubMenu('Outlet Management', 'Outlets', 'Madhuloka liquor', 'Today');
     *
     * Main Menu    → Click "Outlet Management"
     * Sub Menu     → Click "Outlets"
     * Collect Data → Fetch all outlet names, external IDs, created dates from all pages
     * Search       → Find outlet name in collected data
     * Filter       → Select date filter from dropdown
     * Navigate     → Click outlet name to go to outlet details
     */
    async outletMenuAndSubMenu(menu:string,subMenu:string,searchOutletName:string,filter:string):Promise<string[]>{
        //await this.adminPage.adminMenuAndSubMenus(menu, subMenu);
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
        // Validate submenu presence
     await this.page.locator(this.outletSubMenu).first().isVisible(); 

     // Get all subMenu texts as an array(Outlets)
     const text=await this.page.locator(this.outletSubMenu).allTextContents();
     console.log(text);
     await this.page.locator(this.outletSubMenu).click();
     await this.page.locator(this.outletMngPage).isVisible();
     console.log("Successfully Navigates to Outlet Management Page");
     const allOutletNames:string[]=[];
     const allExternalId:string[]=[];
     const allCreatedDate:string[]=[];
     
     while(true){
        const outletNames=await this.page.locator(this.outletNames).allTextContents();
        allOutletNames.push(...outletNames);

        const externalId=await this.page.locator(this.externalId).allTextContents();
        allExternalId.push(...externalId);

        const createdDate=await this.page.locator(this.createdDate).allTextContents();
        allCreatedDate.push(...createdDate);
        //Check if next button is disabled before clicking
        const nextButton = this.page.locator(this.nextButton);
        const isDisabled = await nextButton.isDisabled();

        if (isDisabled) {
            console.log(`All pages done! Total outlets: ${allOutletNames.length}`);
            break; 
        }
        await this.page.locator(this.nextButton).click();
        await this.page.waitForTimeout(1000);
     }
         console.log("\n========== ALL OUTLET NAMES ==========");
         for(let i=0;i<allOutletNames.length;i++){
            console.log(`${i+1}.${allOutletNames[i]}-------External ID:${allExternalId[i]}------${allCreatedDate[i]}`);
         }
        
        const foundOutlet = allOutletNames.find((name: string) => name.trim() === searchOutletName);
        if (foundOutlet) {
        console.log(`Outlet found: ${foundOutlet}`);
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

await this.page.locator(this.outletNameText).click();
return allOutletNames;
}
else {
        //Outlet not found
        console.log(`Outlet "${searchOutletName}" not found in ${allOutletNames.length} outlets`);
        return [];
    }
}
}





