import { Page,expect } from "@playwright/test";
import { OutletMenuNav } from "../outletMenuNavigation";
export class AllOutletNames{
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

     //All outlet name
     outletNames='//a[@class="outlet-name-text mb-1"]';

     //External Id
     externalId='//div[@class="id-chip-modern text-truncate"]';

     //Created Date
     createdDate='(//div[@class="table-cell p-4"]//div[@class="address-snippet"])[position() mod 2 = 0]';
     //NextButton
     nextButton='//span[text()="Next"]';
     
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
    // Navigate to the target page using reusable OutletMenuNav helper
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
        
        
