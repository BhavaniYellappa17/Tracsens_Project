import { Page,expect } from "@playwright/test";
import { OutletPage } from "./outletManagement";
// Used to read files, check if file exists, get file details
import * as fs from 'fs';
// Used to join folder paths correctly for any OS
import * as path from 'path';
//Used to get system information
import * as os from 'os';

export class DashboardPage{
   outletPage:OutletPage;
   
    constructor(public page:Page){
        this.outletPage = new OutletPage(page);
    }

    //**************Locators ****************/

    //AuditsLink
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
    /**
     * Function Name: getDashboardValues
     * Author: Lakshmi
     * Created Date: 2026-05-26
     * Description: This function searches for a specific Audit ID across all pages by:
     * 1. Looping through all rows on the current page to find the matching Audit ID
     * 2. Scrolling to the matched row and clicking the View Performance Dashboard button
     * 3. If not found on current page, clicks Next button and repeats the search
     *
     * After clicking View Dashboard button, this function fetches dashboard values by:
     * 1. Fetching Unique SKUs count value
     * 2. Fetching Detected SKUs count value
     * 3. Waiting for diageo values to load
     * 4. Fetching Unique SKUs diageo value
     * 5. Fetching Detected SKUs diageo value
     * 6. Fetching Retention Rate percentage value
     *
     * After fetching dashboard values, this function handles Missing SKUs by:
     * 1. Fetching all missing SKU items
     * 2. If no missing SKUs found → logs "No Missing SKUs found"
     * 3. If missing SKUs found → logs count and list of missing SKUs
     *
     * After handling missing SKUs, this function exports and verifies PDF by:
     * 1. Deleting old PDF files with same Audit ID from Downloads folder
     * 2. Clicking Export PDF button and waiting for download
     * 3. Saving the downloaded file to Downloads folder
     * 4. Verifying the file name contains the Audit ID
     * 5. Logging the file name and downloaded time
     * 6. Closing the dashboard modal
     *
     * Parameters:
     * @param targetAuditId - The Audit ID to search for (e.g., 'AUD-1767761954121-95a38e24')
     *
     * Example Usage:
     * getDashboardValues('AUD-1767761954121-95a38e24');
     *
     * Search Row     → Find matching Audit ID across all pages
     * View Dashboard → Click View Performance Dashboard button
     * Unique SKUs    → Fetch Unique SKUs count and diageo value
     * Detected SKUs  → Fetch Detected SKUs count and diageo value
     * Retention Rate → Fetch Retention Rate percentage
     * Missing SKUs   → Check and log missing SKUs
     * Export PDF     → Delete old file, download and verify new PDF
     * Close Modal    → Close the dashboard modal
     */
    async getDashboardValues(menu:string,subMenu:string,searchOutletName:string,filter:string,targetAuditId:string){
        await this.outletPage.outletMenuAndSubMenu(menu,subMenu,searchOutletName,filter);
        
        await this.page.locator(this.audits).click();
       while (true) {
    // Get all rows on the current page
      
    const rows = this.page.locator(this.auditId);
    const rowCount = await rows.count();
    //let found = false;
   //Iterate through each row to match the Audit ID
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
     //If the Audit ID matches, scroll to it and click View button
      if (text?.includes(targetAuditId)) {
        await row.scrollIntoViewIfNeeded();
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
    
   

