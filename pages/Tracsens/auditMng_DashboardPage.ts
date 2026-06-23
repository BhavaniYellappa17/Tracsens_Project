import { Page,expect } from "@playwright/test";
import { AuditMenuNav } from "./auditMng_MenuNavigation";

// Used to read files, check if file exists, get file details
import * as fs from 'fs';
// Used to join folder paths correctly for any OS
import * as path from 'path';
//Used to get system information
import * as os from 'os';

export class AuditMng_DashboardPage{
  /**
     * AuditMenuNav instance — handles sidebar menu and submenu navigation
     * Reused from auditMenuNavigation.ts to avoid code duplication
     */
  auditMenuNav: AuditMenuNav;
  
    constructor(public page:Page){
      //Reuse AuditMenuNav for sidebar navigation
        this.auditMenuNav = new AuditMenuNav(page);
        
    }

    //**************Locators ****************/

    //Outlet name link to click and navigate to outlet details
     outletNameText='//span[@class="audit-outlet-name-link"]';

    //Outlet name heading on outlet information page
    outletName='//h2[@class="outlet-name-heading mb-0 fw-black text-dark"]';

    //Outlet Management page header (used for validation)
     outletMngPage='//h1[text()="Outlet Management"]';

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

    //Audits Link
     audits='(//span[@class="tab-label"])[2]';

    //Each row in the Audit ID table
     auditId='//div[@class="sc-dYwGCk knNOUg rdt_TableRow"]';

     //Next button for pagination
     nextButton='//span[text()="Next"]';

    //View Performance Dashboard button in each audit row
    viewDashboard='//button[@title="View Performance Dashboard"]';

    //Unique SKUs count value (e.g., 27)
    uniqueSkusValue='//div[text()="Unique SKUs"]/preceding-sibling::div';

    //Detected SKUs count value (e.g., 42)
    detectedSkusValue='//div[text()="Detected SKUs"]/preceding-sibling::div';

    //Diageo value under Unique SKUs (e.g., diageo: 19)
    uniqueSkusDiageo='//div[text()="Unique SKUs"]/following-sibling::div[@class="audit-stat-sublabel"]';
    
    //Diageo value under Detected SKUs (e.g., diageo: 30)
    detectedSkusDiageo='//div[text()="Detected SKUs"]/following-sibling::div[@class="audit-stat-sublabel"]';

    // Retention Rate percentage value (e.g., 14%)
    retentionRateValue='//div[text()="Retention Rate"]/preceding-sibling::div';

   //Missing SKUs text content next to each missing SKU image
    missingSkus='//div[@class="audit-missing-sku-img-wrap"]/following-sibling::div';

    //Export PDF button inside the dashboard modal
    exportButton='//button[text()="Export PDF"]';

    //Close button to close the dashboard modal
    close='//button[@aria-label="Close"]';

    //There are no records to display
     noRecordsToFoundMessage='//div[text()="There are no records to display"]';

    /**
     * Function Name: getDashboardValues
     * Author: Lakshmi
     * Created Date: 2026-05-26
     * Description: This function performs complete dashboard page operations by:
     *
     * Navigation Steps:
     * 1. Reuses AuditMenuNav to navigate to Audit Management page(handles sidebar menu and submenu clicks internally)
     * Search and Filter Steps:
     * 2. Fills search box with outlet name
     * 3. Opens date filter dropdown and selects given filter
     * 4. Opens status dropdown and selects given status
     * 5. Clicks outlet name to navigate to outlet details page
     * 6. Clicks Audits tab to navigate to audit section
     *
     * Audit Search Steps:
     * 6. Loops through all rows on current page to find matching Audit ID
     * 7. Scrolls to matched row and clicks View Performance Dashboard button
     * 8. If not found on current page, checks if Next button is disabled
     * 9. If Next is disabled logs Audit ID not found and stops
     * 10.If Next is enabled clicks Next and repeats search
     *
     * Dashboard Values Extraction Steps:
     * 11. Fetches and logs Unique SKUs count value
     * 12. Fetches and logs Detected SKUs count value
     * 13. Waits for diageo values to fully load
     * 14. Fetches and logs Unique SKUs diageo value
     * 15. Fetches and logs Detected SKUs diageo value
     * 16. Fetches and logs Retention Rate percentage value
     *
     * Missing SKUs Steps:
     * 17. Fetches all missing SKU items
     * 18. If no missing SKUs found logs "No Missing SKUs found"
     * 19. If missing SKUs found logs count and complete list
     *
     * PDF Export Steps:
     * 20. Deletes any existing PDF files for this Audit ID from Downloads folder
     * 21. Clicks Export PDF button and waits for download event
     * 22. Saves downloaded PDF to Downloads folder
     * 23. Verifies PDF file exists with correct name and timestamp
     * 24. Closes the dashboard modal after processing
     *
     * @param menu             - Main menu name to click (e.g., "Audit Management")
     * @param subMenu          - Sub menu name to click (e.g., "Audits")
     * @param searchOutletName - Outlet name to search (e.g., "Madhuloka liquor")
     * @param status           - Status value to select(e.g, "All Status")
     * @param filter           - Filter value to select (e.g., "Today")
     * @param targetAuditId    - Audit ID to search for (e.g., "AUD-1767761954121-95a38e24")
     *
     * Example Usage:
     * await getDashboardValues('Audit Management', 'Audits', 'Madhuloka liquor','All Status', 'Today', 'AUD-123');
     */
    async getDashboardValues(menu:string,subMenu:string,searchOutletName:string,filter:string,status:string,targetAuditId:string){
      //Reuse AuditMenuNav to navigate to Audit Management page,This handles sidebar menu click and submenu click 
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
            console.log(`Status "${status}" not found.`);
            return; 
        }
    } else {
        console.log(`Invalid Input — Status field is empty.`);
        return; 
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
            console.log(`Filter "${filter}" not found`);
            return; 
        }
    } else {
        console.log(`Invalid Input — filter field is empty.`);
        return; 
    }

    const noRecordsVisible = await this.page.locator(this.noRecordsToFoundMessage).isVisible().catch(() => false);
    if (noRecordsVisible) {
        console.log(`No records found for Status: "${status}" and Filter: "${filter}"`);
        console.log("There are no records to display");
        return;
    }
     
await this.page.locator(this.outletNameText).waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
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


      await this.page.locator(this.audits).click();
      await this.page.waitForTimeout(2000);
        while (true) {
    // Get all rows on the current page
      
    const rows = this.page.locator(this.auditId);
    await rows.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    const rowCount = await rows.count();
    //let found = false;
   //Iterate through each row to match the Audit ID
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
     //If the Audit ID matches, scroll to it and click View button
      if (text?.includes(targetAuditId)) {
        await row.scrollIntoViewIfNeeded();
        await this.page.locator(this.viewDashboard).waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        await row.locator(this.viewDashboard).click();
        console.log("\n========== DASHBOARD VALUES ==========");
        
        const uniqueSkus=await this.page.locator(this.uniqueSkusValue).textContent();
        console.log("UniqueSkusValue:",uniqueSkus);

        
        const detectedSkus=await this.page.locator(this.detectedSkusValue).textContent();
        console.log("detectedSkusValue:",detectedSkus);
        
        //const uniqueSkus_Diageo = await this.page.locator('div:has-text("diageo")').nth(0).innerText();
        //console.log(uniqueSkus_Diageo);
        await this.page.waitForTimeout(5000);
        const uniqueSkus_Diageo = await this.page.locator(this.uniqueSkusDiageo).textContent();
        console.log("UniqueSkusDiageo:",uniqueSkus_Diageo);

        const detectedSkus_Diageo=await this.page.locator(this.detectedSkusDiageo).textContent();
        console.log("detectedSkusDiageo:",detectedSkus_Diageo);

        const retentionRate=await this.page.locator(this.retentionRateValue).textContent();
        console.log("retentionRateValue:",retentionRate);

        const missingSkus = await this.page.locator(this.missingSkus).allTextContents();
        // Check if missing skus are empty or not
        if (missingSkus.length === 0) {
        console.log("No Missing SKUs found");
        } 
        else 
      {
          console.log(`Missing SKUs found (${missingSkus.length}):`);
          console.log(missingSkus);
          
      }
        
        console.log("\n========== EXPORT DASHBOARD PDF==========");
        // Step 1: Delete old files
         const downloadsFolder = path.join(os.homedir(), 'Downloads');
         fs.readdirSync(downloadsFolder).filter((file: string) => file.includes(targetAuditId) && file.endsWith('.pdf')).forEach((file: string) => {
         fs.unlinkSync(path.join(downloadsFolder, file));
         console.log(`Old file deleted: ${file}`);
        });

          // Step 2: Click Export PDF and wait for download
          const [download] = await Promise.all([
          this.page.waitForEvent('download'),
          this.page.locator(this.exportButton).click()
         ]);

          // Step 3: Save file
          const fileName = await download.suggestedFilename();
          const savePath = path.join(downloadsFolder, fileName);
          console.log(savePath);
          await download.saveAs(savePath);

         // Step 4: Verify file
        if (fileName.includes(targetAuditId) && fileName.endsWith('.pdf')) {
             const downloadedTime = fs.statSync(path.join(downloadsFolder, fileName)).mtime;
             //const date = `${String(downloadedTime.getDate()).padStart(2,'0')}-${String(downloadedTime.getMonth()+1).padStart(2,'0')}-${downloadedTime.getFullYear()}`;
             const time = `${String(downloadedTime.getHours()).padStart(2,'0')}:${String(downloadedTime.getMinutes()).padStart(2,'0')}:${String(downloadedTime.getSeconds()).padStart(2,'0')}`;
             console.log(`PDF found: ${fileName}:${time}`);
        } 
        else {
               console.log(`PDF not found for: ${targetAuditId}`);
            }
        await this.page.locator(this.close).click();
        return;
    }
  }
  const nextBtn = this.page.locator(this.nextButton);

    //check if disabled
    if (await nextBtn.isDisabled()) {
      console.log(`Audit ID not found: ${targetAuditId}`);
      break;
    }

    await nextBtn.click();

    
  }
}
}
    
   

