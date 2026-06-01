import { Page,expect } from "@playwright/test";
import { OutletPage } from "./outletManagement";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class AuditPage{
   outletPage:OutletPage;
    constructor(public page:Page){
        this.outletPage = new OutletPage(page);
    }
     //****************** Locators ***************/
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
     * Function Name: auditsPage
     * Author: Lakshmi
     * Created Date: 2026-05-25
     * Description: This function searches for a specific Audit ID across all pages by:
     * 1. Navigating to the Audits section
     * 2. Looping through all rows on the current page to find the matching Audit ID
     * 3. Scrolling to the matched row and clicking the View button
     * 4. If not found on current page, clicks Next button and repeats the search
     *
     * After clicking View button, this function performs filter operations by:
     * 1. Waiting for the filter modal to open
     * 2. Clicking Reset All Filters button
     * 3. Clicking the Filter by Category dropdown
     * 4. Selecting the given category from the dropdown options
     * 
     *
     * After selecting category, this function fetches rack details by:
     * 1. Getting total number of racks available
     * 2. Clicking each rack one by one
     * 3. Fetching all brands and SKUs for each rack
     * 4. Exporting PDF 
     *
     * Parameters:
     * @param targetAuditId  - The Audit ID to search for (e.g., 'AUD-1756202792595-df67f19d')
     * @param selectCategory - The category name to select from dropdown (e.g., 'PREMIUM_WHISKY')
     *
     * Example Usage:
     * auditsPage('AUD-1756202792595-df67f19d', 'PREMIUM_WHISKY');
     *
     * Audits Tab    → Navigate to Audits section
     * Search Row    → Find matching Audit ID across all pages
     * View Button   → Click when Audit ID matches
     * Reset Filter  → Click Reset All Filters
     * Category      → Select category from dropdown
     * Rack Loop     → Click each rack and fetch brands and SKUs
     * Export PDF    → Download audit report as PDF
     * Close Modal   → Close the audit modal
     */
async auditsPage(menu:string,subMenu:string,searchOutletName:string,filter:string,targetAuditId: string, selectCategory: string) {
  await this.outletPage.outletMenuAndSubMenu(menu,subMenu,searchOutletName,filter);
//Navigate to the Audits section
  await this.page.locator(this.audits).click();
//Loop through all pages to find the target Audit ID
  while (true) {
    // Get all rows on the current page
    const rows = this.page.locator(this.auditId);
    const rowCount = await rows.count();
   //Iterate through each row to match the Audit ID
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const text = await row.textContent();
     //If the Audit ID matches, scroll to it and click View button
      if (text?.includes(targetAuditId)) {
        await row.scrollIntoViewIfNeeded();
        await row.locator(this.viewButton).click();
        console.log("\n========== AUDIT INFORMATION ==========");
        console.log(`Clicked View for: ${targetAuditId}`);
        await this.page.waitForTimeout(1000);
        
        //Reset all filters inside the modal
        await this.page.locator(this.restFilter).click();
        await this.page.locator(this.filterByCategory).click();
       //Get all available category options from the dropdown
        const allCategories = await this.page.locator(this.categories).allTextContents();
        console.log(allCategories);
       //Check if the requested category exists and select it
        let categoryFound = false;
        for (const item of allCategories) {
          if (item.trim() === selectCategory) {
            try {
              await this.page.locator(this.filterByCategory).selectOption({ label: selectCategory });
              //await this.page.locator('//select[@id="categorySelect"]').selectOption({ label: selectCategory });
              console.log(`Category "${item}" was successfully selected.`);
              categoryFound = true;
              break;
            } catch (error) {
              console.log(`Error while clicking ${item}:`, error);
            }
          }
        }

        if (!categoryFound) {
          console.log(`Category "${selectCategory}" not available in dropdown.`);
        }
        const nOfRacks=await this.page.locator(this.racks);
        const rackcount=await nOfRacks.count();
        console.log(rackcount);
        for(let i=0;i<rackcount;i++){
            await this.page.locator(this.racks).nth(i).click();
            await this.page.waitForTimeout(1000); 
            const rackName = await this.page.locator(this.rackNumber).nth(i).textContent();
            console.log(`Rack Name: ${rackName}`);
            await this.page.locator(this.brand).click();
            const getBrands=await this.page.locator(this.allBrands).allTextContents();
            console.log(`Brands:`,getBrands);
            await this.page.locator(this.skus).click();
            const getSkus=await this.page.locator(this.allSKUs).allTextContents();
            console.log(`SKUs:`,getSkus);
            // Step 1: Delete old files
            const downloadsFolder = path.join(os.homedir(), 'Downloads');
            fs.readdirSync(downloadsFolder).filter((file: string) => file.includes(targetAuditId) && file.endsWith('.pdf')).forEach((file: string) => {
            fs.unlinkSync(path.join(downloadsFolder, file));
            console.log("\n==========  EXPORT AUDIT PDF==========");
            console.log(`Old file deleted: ${file}`);
            });
        
            // Step 2: Click Export PDF and wait for download
            const [download] = await Promise.all([
            this.page.waitForEvent('download'),
            this.page.locator(this.exportPdf).click()
            ]);
        
            // Step 3: Save file
            const fileName = await download.suggestedFilename();
            const savePath = path.join(downloadsFolder, fileName);
            console.log(savePath);
            await download.saveAs(savePath);
            
        
            // Step 4: Verify file
            if (fileName.includes(targetAuditId) && fileName.endsWith('.pdf')) {
                     const downloadedTime = fs.statSync(path.join(downloadsFolder, fileName)).mtime;
                     const date = `${String(downloadedTime.getDate()).padStart(2,'0')}-${String(downloadedTime.getMonth()+1).padStart(2,'0')}-${downloadedTime.getFullYear()}`;
                     const time = `${String(downloadedTime.getHours()).padStart(2,'0')}:${String(downloadedTime.getMinutes()).padStart(2,'0')}:${String(downloadedTime.getSeconds()).padStart(2,'0')}`;
                     console.log(`PDF found: ${fileName}-${date}:${time}`);
                } 
            else {
                       console.log(`PDF not found for: ${targetAuditId}`);
                    }
                    
        }
            await this.page.locator(this.closeButton).click();
            return;

         
      }
    }
     //If Audit ID not found on current page, navigate to next page
    await this.page.locator(this.nextButton).click();
    
    
  }

}

}
