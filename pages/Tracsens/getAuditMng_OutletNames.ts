import { Page,expect } from "@playwright/test";
import { AuditMenuNav } from "./auditMng_MenuNavigation";
export class AllOutletNames_AuditPage{
    //Reusable navigation helper instance used to perform sidebar menu and submenu navigation across all page objects.
    //Initialized once in the constructor and reused throughout the class.
    auditMenuNav: AuditMenuNav;
    
    constructor(public page:Page){
        // ✅ Initialize reusable AuditMenuNav instance for sidebar navigation
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
     status='(//select[@class="select-premium-filter form-select"])[1]';

     //All dropdown options under created date filter
     selectOptions='(//select[@class="select-premium-filter form-select"])[2]/option';

     //Select Status
     allStatus='(//select[@class="select-premium-filter form-select"])[1]/option';

     //Expand Table
     expandTable='//button[@class="fw-semibold btn btn-outline-primary"]';

     
     //All outlet name
     outletNames='//span[@class="audit-outlet-name-link"]';

     //OutletStatus
     outletStatus='//span[@class="status-badge-inline completed"]';

     //Created Date and Time
     createdDateAndTime='//div[@data-column-id="4"][@role="cell"]';

     //Next Button
     nextButton='//span[text()="Next"]';

     //There are no records to display
     noRecordsToFoundMessage='//div[text()="There are no records to display"]';

     //Rack Count
     rackCount='//div[@class="sc-ggWZvA sc-dTvVRJ sc-jwTyAe iBnlJP jjhabC jQKZqR rdt_TableCell"]';

     //Unique Skus
     uniqueSkus='//div[@class="sc-ggWZvA sc-dTvVRJ sc-jwTyAe iBnlJP kxoxXp jQKZqR rdt_TableCell"]';

     //detected skus
     detectedSkus='//div[@class="sc-ggWZvA sc-dTvVRJ sc-jwTyAe iBnlJP faHMk jQKZqR rdt_TableCell"]';

     //SKU Change
     skuChange='//div[@class="sc-ggWZvA sc-dTvVRJ sc-jwTyAe iBnlJP kxoxXp iOgaEC rdt_TableCell"]';

     //SKU Change Percentage 
     skuChangePercentage='//div[@class="sc-ggWZvA sc-dTvVRJ sc-jwTyAe iBnlJP faHMk iOgaEC rdt_TableCell"]';

     //Detected SKU Change
     detectedSkuChange='//div[@class="sc-ggWZvA sc-dTvVRJ sc-jwTyAe iBnlJP dfTqnt iOgaEC rdt_TableCell"]';


     //Detected SKU Change percentage
     detectedSkuPercentage='//div[@class="sc-ggWZvA sc-dTvVRJ sc-jwTyAe iBnlJP bJQLez iOgaEC rdt_TableCell"]';

    /**
     * @function   getAllOutletNames_AuditMng
     * @author     Lakshmi
     * @date       2026-06-04
     *
     * @description
     * Navigates to the Audit Management → Audits page and retrieves
     * all outlet details across all paginated pages including:
     *   - Outlet Names
     *   - Created Dates
     *   
     *
     * @testFlow
     * 1. Navigate to Audit Management page via AuditMenuNav
     * 2. Validate and select status from dropdown
     * 3. Validate and select date filter from dropdown
     * 4. Check if "no records" message is visible — return early if no data
     * 5. Collect all outlet data across paginated pages
     * 7. Log all collected outlet details in structured format
     * 8. Return complete list of outlet names
     *
     * @param {string} menu    - Main menu name (e.g., "Audit Management")
     * @param {string} subMenu - Submenu name   (e.g., "Audits")
     * @param {string} filter  - Date filter    (e.g., "All time", "Last month")
     * @param {string} status  - Status filter  (e.g., "All status", "Completed")
     *
     * @returns {Promise<string[]>} - Array of all outlet names collected from all pages
     *
     * @example
     * // ✅ Valid usage:
     * const outlets = await allOutletNames.getAllOutletNames_AuditMng(
     *     'Audit Management', 'Audits', 'All time', 'All status'
     * );
     *
     * @note
     * - Returns empty array [] for invalid/empty status or filter
     * - Returns empty array [] when no records match the applied filters
     * - Pagination handled automatically until Next button is disabled
     */
    async getAllOutletNames_AuditMng(menu:string,subMenu:string,filter:string,status:string):Promise<string[]>{
        // Navigate to Audit Management page via reusable AuditMenuNav helper
        await this.auditMenuNav.auditMenuAndSubMenu(menu, subMenu);
     
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
        console.log(`Message displayed:'There are no records to display'`);
        return [];
    }
     
    let filterFound  = false;
    await this.page.locator(this.expandTable).click();
    const allOutletNames:string[]=[];
    const allCreatedDate:string[]=[];
    const outletStatus:string[]=[];
    const outletRackCount:string[]=[];
    const uniqueSkus:string[]=[];
    const detectedSkus:string[]=[];
    const skuChange:string[]=[];
    const skusChangePercentage:string[]=[];
    const detectedSkuChange:string[]=[];
    const detectedSkuPercentage:string[]=[];
     
     while(true){
        const outletNames=await this.page.locator(this.outletNames).allTextContents();
        allOutletNames.push(...outletNames);
        const createdDate=await this.page.locator(this.createdDateAndTime).allTextContents();
        allCreatedDate.push(...createdDate);
        const getOutletStatus=await this.page.locator(this.outletStatus).allTextContents();
        outletStatus.push(...getOutletStatus);
        const getOutletRackCounts=await this.page.locator(this.rackCount).allTextContents();
        outletRackCount.push(...getOutletRackCounts);
        const getAllUniqueSkus=await this.page.locator(this.uniqueSkus).allTextContents();
        uniqueSkus.push(...getAllUniqueSkus);
        const getAllDetectedSkus=await this.page.locator(this.detectedSkus).allTextContents();
        detectedSkus.push(...getAllDetectedSkus);
        const getSkuChangeValue=await this.page.locator(this.skuChange).allTextContents();
        skuChange.push(...getSkuChangeValue);
        const getskuChangePercentage=await this.page.locator(this.skuChangePercentage).allTextContents();
        skusChangePercentage.push(...getskuChangePercentage);
        const getdetectedSkuChange=await this.page.locator(this.detectedSkuChange).allTextContents();
        detectedSkuChange.push(...getdetectedSkuChange);
        const getdetectedSkuChangePercentage=await this.page.locator(this.detectedSkuPercentage).allTextContents();
        detectedSkuPercentage.push(...getdetectedSkuChangePercentage);

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
            console.log(`${i+1}. ${allOutletNames[i]} ------Status:${outletStatus[i]}----CreatedDate: ${allCreatedDate[i]} ----- RackCount: ${outletRackCount[i]}----UniqueSkus:${uniqueSkus[i]}---DetectedSkus:${detectedSkus[i]}---SkuChange:${skuChange[i]}---SkuChangePercentage:${skusChangePercentage[i]}---detectedSkuChange:${detectedSkuChange[i]}---detectedSkuChangePercentage:${detectedSkuPercentage[i]}`);
         }
         return allOutletNames;
    }
        }
        




