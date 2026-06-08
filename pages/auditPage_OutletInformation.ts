import { Page,expect } from "@playwright/test";
import { AuditMenuNav } from "./Tracsens/auditMng_MenuNavigation";

export class AuditPng_OutletInformationPage{
    /**
     * AuditMenuNav instance — handles sidebar menu and submenu navigation
     * Reused from auditMenuNavigation.ts to avoid code duplication
     */
    auditMenuNav: AuditMenuNav;
    
  constructor(public page:Page){
    // Reuse AuditMenuNav for sidebar navigation
        this.auditMenuNav = new AuditMenuNav(page);
        
    }

    //******************* Locators ******************/

    // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet,audit Management )
     homePageMenuItems='//a[contains(@class,"sidebar-link")]//span';

      // Submenu items under AuditManagement (Audits)
     auditSubMenu='//span[@class="lan-4"]';

     //Audit Management page header (used for validation)
     auditMngPage='//h1[text()="Audit Management"]';

     //Search input field for outlet name
     searchByOutletNames='//input[@placeholder="Search by outlet name..."]';

     //Created date filter dropdown
     filter='(//select[@class="select-premium-filter form-select"])[2]';

     //All Status
     status='(//select[@class="select-premium-filter form-select"])[1]'

     //All dropdown options under created date filter
     selectOptions='(//select[@class="select-premium-filter form-select"])[2]/option';

     //Select Status
     allStatus='(//select[@class="select-premium-filter form-select"])[1]/option';

     //Expand Table
     expandTable='//button[@class="fw-semibold btn btn-outline-primary"]';

     //Outlet Information link
     outletInformationLink='//span[text()="Outlet Information"]';

     //Outlet Name
     outletName='//h2[@class="outlet-name-heading mb-0 fw-black text-dark"]';
     
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
    
    //Outlet name link to click and navigate to outlet details
     outletNameText='//span[@class="audit-outlet-name-link"]';

     //There are no records to display
     noRecordsToFoundMessage='//div[text()="There are no records to display"]';

     //AuditsLink
     audits='(//span[@class="tab-label"])[2]';

/**
     * @function   auditPageOutletInformation
     * @author     Lakshmi
     * @date       2026-05-27
     *
     * @description
     * Performs end-to-end navigation and data extraction for a specific
     * outlet's information page from within the Audit Management module.
     *
     * @testFlow
     * Navigation:
     *   1. Reuses AuditMenuNav to navigate to Audit Management page
     *      (handles sidebar menu and submenu clicks internally)
     *
     * Search and Filter:
     *   2. Fills the search box with the given outlet name
     *   3. Validates and selects status from dropdown
     *   4. Validates and selects date filter from dropdown
     *   5. Checks if "no records" message is visible — returns early if no data
     *   6. Clicks the matching outlet name to navigate to outlet details page
     *
     * Data Extraction:
     *   7.  Clicks the Outlet Information tab
     *   8.  Fetches and logs Outlet Name
     *   9.  Fetches and logs External ID
     *   10. Fetches and logs System ID
     *   11. Fetches and logs Registered Address
     *   12. Fetches and logs Secondary/Unit address
     *   13. Fetches and logs City/Township
     *   14. Fetches and logs Region/Territory
     *   15. Fetches and logs State/Province
     *   16. Fetches and logs Postal Index Code
     *   17. Fetches and logs Coordinates (Lat/Lng)
     *   18. Fetches and logs Created Date
     *
     * @param {string} menu             - Main menu name to click  (e.g., "Audit Management")
     * @param {string} subMenu          - Sub menu name to click   (e.g., "Audits")
     * @param {string} searchOutletName - Outlet name to search    (e.g., "Madhuloka liquor")
     * @param {string} filter           - Filter value to select   (e.g., "All time")
     * @param {string} status           - Status value to select   (e.g., "All status")
     * @returns {Promise<void | []>}    - Returns empty array for invalid/empty inputs
     *
     * @example
     * // ✅ Valid usage:
     * await auditOutletInfo.auditPageOutletInformation(
     *     'Audit Management', 'Audits', 'Madhuloka liquor', 'All time', 'All status');
     *
     * // ❌ Invalid usage — empty status:
     * await auditOutletInfo.auditPageOutletInformation(
     *     'Audit Management', 'Audits', 'Madhuloka liquor', 'All time', '');
     */
    async auditPageOutletInformation(menu:string,subMenu:string,searchOutletName:string,filter:string,status:string):Promise<void | []>{
        //Reuse AuditMenuNav to navigate to Audit Management page
        // This handles sidebar menu click and submenu click internally
        await this.auditMenuNav.auditMenuAndSubMenu(menu, subMenu);
        await this.page.locator(this.searchByOutletNames).fill(searchOutletName);
    await this.page.locator(this.status).click();
     const allStatus=await this.page.locator(this.allStatus).allTextContents();
     console.log(allStatus);
     if (status && status.trim() !== '') {
        const statusExists = allStatus.map(s => s.trim()).includes(status.trim());
        if (statusExists) {
            await this.page.locator(this.status).selectOption({ label: status });
            console.log(`Status "${status}" selected.`);
        } else {
            console.log(`Status "${status}" not found in dropdown. Skipping.`);
            return []; 
        }
    } else {
        console.log(`Empty status provided. Skipping status selection.`);
        return []; 
    }
     
     await this.page.locator(this.filter).click();
     const selectDateFilter=await this.page.locator(this.selectOptions).allTextContents();
     console.log(selectDateFilter);
     if (filter && filter.trim() !== '') {
        const filterExists = selectDateFilter.map(f => f.trim()).includes(filter.trim());
        if (filterExists) {
            await this.page.locator(this.filter).selectOption({ label: filter });
            console.log(`Filter "${filter}" selected.`);
        } else {
            console.log(`Filter "${filter}" not found in dropdown. Skipping.`);
            return []; 
        }
    } else {
        console.log(`Empty filter provided. Skipping filter selection.`);
        return []; 
    }

    const noRecordsVisible = await this.page.locator(this.noRecordsToFoundMessage).isVisible().catch(() => false);
    if (noRecordsVisible) {
        console.log(`No records found for Status: "${status}" and Filter: "${filter}"`);
        console.log(`Message displayed: "There are no records to display"`);
        return [];
    }
     

// Get all outlet names after search
const results = await this.page.locator(this.outletNameText).allTextContents();
console.log(results);

// Check if searched outlet exists
const match = results.find(name =>name.trim().toLowerCase() === searchOutletName.trim().toLowerCase());
if (match) {
    console.log(`Outlet found: ${match}`);

    // Click exact matching outlet
    await this.page.locator(`//span[@class="audit-outlet-name-link" and text()='${match}']`).first().click();
   

} else {
    console.log(`Outlet "${searchOutletName}" not found`);
}

        
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