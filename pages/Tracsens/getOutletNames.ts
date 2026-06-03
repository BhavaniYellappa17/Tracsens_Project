import { Page,expect } from "@playwright/test";
import { OutletMenuNav } from "../outletMenuNavigation";
export class AllOutletNames{
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
 * Function Name: getAllOutletNames
 * Author: Lakshmi
 * Created Date: 2026-06-03
 *
 * Description:
 * This function navigates to the Outlet Management → Outlets page
 * and retrieves all outlet details across multiple pages.
 *
 * Functionality:
 * 1. Navigates to the required menu and submenu using reusable navigation method
 * 2. Iterates through all paginated pages
 * 3. Collects:
 *    - Outlet Names
 *    - External IDs
 *    - Created Dates
 * 4. Continues fetching data until the "Next" button is disabled
 * 5. Logs all collected outlet details in a structured format
 * 6. Returns the complete list of outlet names
 *
 * Parameters:
 * @param menu    - Main menu name (e.g., "Outlet Management")
 * @param subMenu - Submenu name (e.g., "Outlets")
 *
 * Returns:
 * @returns Promise<string[]> - Array of all outlet names collected from all pages
 *
 * Example Usage:
 * const outlets = await getAllOutletNames('Outlet Management', 'Outlets');
 *
 * Notes:
 * - Assumes pagination is controlled using a "Next" button
 * - Data is fetched page by page until no more pages are available
 */
    async getAllOutletNames(menu:string,subMenu:string):Promise<string[]>{
     await this.outletMenuNav.outletMenuAndSubMenu(menu, subMenu);
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
         return allOutletNames;
    }
        }
        
        
//         const foundOutlet = allOutletNames.find((name: string) => name.trim() === searchOutletName);
//         if (foundOutlet) {
//         console.log(`Outlet found: ${foundOutlet}`);
//         await this.page.locator(this.searchByOutletNames).fill(searchOutletName);
//         await this.page.locator(this.filterDate).click();
//         const options = await this.page.locator(this.selectOptions).allTextContents();
//         console.log(options);
//         let filterFound  = false;
//      // Loop through dropdown options to find matching filter
//      for (const item of options) {
//              if (item.trim() === filter) {
//               try {
//                     await this.page.locator(this.filterDate).selectOption({ label: filter });
//                     console.log(`Filter "${item}" was successfully selected from the dropdown.`);
//                     filterFound = true;
//                     break;
    
//                 } catch (error) 
//                 {
//                     console.log(`Error while clicking ${item}:`, error);
//                 }
       
//            }
//         }
// // If filter not found
// if (!filterFound) {
//   console.log(`Filter "${filter}" not available in dropdown.`);
// }

// await this.page.locator(this.outletNameText).click();
// return allOutletNames;
// }
// else {
//         //Outlet not found
//         console.log(`Outlet "${searchOutletName}" not found in ${allOutletNames.length} outlets`);
//         return [];
//     }
// }
// }





