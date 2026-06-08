import { Page,expect } from "@playwright/test";
import { AuditMenuNav } from "./auditMng_MenuNavigation";
export class SearchOutletName_AuditPage{
    // Instance of AuditMenuNav to reuse menu navigation logic
    auditMenuNav: AuditMenuNav;
    constructor(public page:Page){
        this.auditMenuNav = new AuditMenuNav(page);
    }
    // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet,Audit Management )
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


     //Outlet name link to click and navigate to outlet details
     outletNameText='//span[@class="audit-outlet-name-link"]';

     //There are no records to display message
     noRecordsToFoundMessage='//div[text()="There are no records to display"]';

     //Outlet Information page header (used for validation)
     outletInformationText='//h1[text()="Outlet Information"]';

/**
 * Function Name: searchOutletName_AuditPage
 * Author: Lakshmi
 * Created Date: 2026-06-04
 *
 * Description:
 * This function performs end-to-end operations in the Audit Management module:
 *
 * Navigation Steps:
 * 1. Navigates to the specified main menu (e.g., "Audit Management")
 * 2. Clicks on the given sub menu (e.g., "Audits")
 * 3. Validates navigation to Audit Management page
 *
 * Search Steps:
 * 4. Enters the given outlet name in search box
 * 5. Waits for results to load dynamically
 *
 * Status Filter Steps:
 * 6. Opens status dropdown
 * 7. Reads all available status options
 * 8. Checks if given status exists
 * 9. Selects status if available, else logs and exits
 *
 * Date Filter Steps:
 * 10. Opens date filter dropdown
 * 11. Reads all available filter options
 * 12. Checks if given filter exists
 * 13. Selects filter if available, else logs and exits
 *
 * Validation Steps:
 * 14. Checks if "No records found" message is displayed
 * 15. If yes, logs message and exits
 *
 * Result Handling:
 * 16. Fetches all outlet names from results
 * 17. Performs case-sensitive match with input
 * 18. If match found:
 *     - Logs success
 *     - Clicks outlet to navigate to details page
 * 19. If not found:
 *     - Logs "Outlet not found"
 *
 * Parameters:
 * @param menu             - Main menu name (e.g., "Audit Management")
 * @param subMenu          - Sub menu name (e.g., "Audits")
 * @param searchOutletName - Outlet name to search(e.g,"OutletName")
 * @param filter           - Date filter value (e.g., "All time")
 * @param status           - Status filter value (e.g., "Completed")
 *
 * Example Usage:
 * await searchOutletName_AuditPage(
 *   "Audit Management",
 *   "Audits",
 *   "Madhuloka liquor",
 *   "All time",
 *   "Completed"
 * );
 *
 * Flow:
 * Navigate → Search → Apply Status → Apply Filter → Validate → Click Outlet
 */

    async searchOutletName_AuditPage(menu:string,subMenu:string,searchOutletName:string,filter:string,status:string){
    // Reuseable step: Navigate to Audit Management → Audits
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
    //Check if "No records found" message is visible
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

}
}





