import { Page,expect } from "@playwright/test";
import { OutletMenuNav } from "../outletMenuNavigation";

export class OutletInformationPage{
    /**
     * OutletMenuNav instance — handles sidebar menu and submenu navigation
     * Reused from outletMenuNavigation.ts to avoid code duplication
     */
    outletMenuNav: OutletMenuNav;
    
  constructor(public page:Page){
    // Reuse OutletMenuNav for sidebar navigation
        this.outletMenuNav = new OutletMenuNav(page);
        
    }

    //******************* Locators ******************/

    // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet )
     homePageMenuItems='//a[contains(@class,"sidebar-link")]//span';

     // Submenu items under OutletManagement (Outlets)
     outletSubMenu='(//a/span[@class="lan-5"])[1]';

     // Outlet Information tab link on outlet details page
    outletInformationLink='//span[text()="Outlet Information"]';

    //Outlet name link to click and navigate to outlet details
     outletNameText='//a[@class="outlet-name-text mb-1"]';

    //Outlet name heading on outlet information page
    outletName='//h2[@class="outlet-name-heading mb-0 fw-black text-dark"]';

    //Outlet Management page header (used for validation)
     outletMngPage='//h1[text()="Outlet Management"]';

     //Search input field for outlet name
     searchByOutletNames='//input[@placeholder="Search by name, external id, or location..."]';

     //Created date filter dropdown
     filterDate='//select[@class="input-created-filter-type form-select"]';

     //All dropdown options under created date filter
     selectOptions='//select[@class="input-created-filter-type form-select"]/option';

    //External ID value 
    externalId=`(//p[contains(@class,'outlet-ids-line')]//span[@class='fw-bold text-dark'])[1]`;

    //System ID value
    systemId='(//p[contains(@class,"outlet-ids-line")]//span[@class="fw-bold text-dark"])[2]';

    //Registered Address value following the label
    registeredAddress='//label[text()="Registered Address"]//following-sibling::p';

    //Secondary or Unit address value following the label
    secondaryAddress='//label[text()="Secondary / Unit"]//following-sibling::p';

    //City or Township value following the label
    city='//label[text()="City / Township"]//following-sibling::p';

    //Region or Territory value following the label
    region='//label[text()="Region / Territory"]//following-sibling::p';

    //State
    state='//label[text()="State / Province"]//following-sibling::p';

    //Postal Code value following the label
    postalCode='//label[text()="Postal Index Code"]//following-sibling::p';

    //Coordinates (Lat/Lng)
    coordinates='//label[text()="Coordinates (Lat/Lng)"]//following-sibling::div';

    //Created Date
    createdDate='//div[contains(@class,"identity-updated-col")]//span';

    //AuditsLink
     audits='(//span[@class="tab-label"])[2]';
/**
     * Function Name: outletInformation
     * Author: Lakshmi
     * Created Date: 2026-05-27
     * Description: This function performs end-to-end navigation and data
     * extraction for a specific outlet's information page by:
     *
     * Navigation Steps:
     * 1. Reuses OutletMenuNav to navigate to Outlet Management page
     *    (handles sidebar menu and submenu clicks internally)
     *
     * Search and Filter Steps:
     * 2. Fills the search box with the given outlet name
     * 3. Opens the date filter dropdown
     * 4. Loops through filter options to find and select the given filter
     * 5. Clicks the outlet name to navigate to outlet details page
     *
     * Data Extraction Steps:
     * 6.  Clicks the Outlet Information tab
     * 7.  Fetches and logs Outlet Name
     * 8.  Fetches and logs External ID
     * 9.  Fetches and logs System ID
     * 10. Fetches and logs Registered Address
     * 11. Fetches and logs Secondary/Unit address
     * 12. Fetches and logs City/Township
     * 13. Fetches and logs Region/Territory
     * 14. Fetches and logs State/Province
     * 15. Fetches and logs Postal Index Code
     * 16. Fetches and logs Coordinates (Lat/Lng)
     * 17. Fetches and logs Created Date
     *
     * @param menu             - Main menu name to click (e.g., "Outlet Management")
     * @param subMenu          - Sub menu name to click (e.g., "Outlets")
     * @param searchOutletName - Outlet name to search (e.g., "Madhuloka liquor")
     * @param filter           - Filter value to select (e.g., "All time")
     *
     * Example Usage:
     * await outletInformation('Outlet Management', 'Outlets', 'Madhuloka liquor', 'All time');
     */
    async outletInformation(menu:string,subMenu:string,searchOutletName:string,filter:string){
        //Reuse OutletMenuNav to navigate to Outlet Management page
        // This handles sidebar menu click and submenu click internally
        await this.outletMenuNav.outletMenuAndSubMenu(menu, subMenu);
        await this.page.locator(this.searchByOutletNames).fill(searchOutletName);
        await this.page.locator(this.filterDate).click();
        const options = await this.page.locator(this.selectOptions).allTextContents();
        console.log(options);
        await this.page.locator(this.filterDate).selectOption({ label: filter });
        await this.page.locator(this.outletNameText).waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
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

        await this.page.waitForTimeout(2000);
        await this.page.locator(this.outletInformationLink).click();
        console.log("\n========== OUTLET INFORMATION ==========");

        const outletName=await this.page.locator(this.outletName).textContent();
        console.log("Outlet Name:",outletName);

        const externalId=await this.page.locator(this.externalId).textContent();
        console.log("External Id:",externalId);

        const systemId=await this.page.locator(this.systemId).textContent();
        console.log("System Id:",systemId);

        const registeredAddress=await this.page.locator(this.registeredAddress).textContent();
        console.log("Registered Address:",registeredAddress);

        const secondaryOrUnit=await this.page.locator(this.secondaryAddress).textContent();
        console.log("Secondary/Unit:",secondaryOrUnit);

        const city=await this.page.locator(this.city).textContent();
        console.log("City/Township:",city);

        const region=await this.page.locator(this.region).textContent();
        console.log("Region:",region);

        const state=await this.page.locator(this.state).textContent();
        console.log("State:",state);

        const postalCode=await this.page.locator(this.postalCode).textContent();
        console.log("Postal Code:",postalCode);

        const coordinates=await this.page.locator(this.coordinates).textContent();
        console.log("Coordinates (Lat/Lng):",coordinates);

        const createdDate=await this.page.locator(this.createdDate).textContent();
        console.log(createdDate);
        
    }

}