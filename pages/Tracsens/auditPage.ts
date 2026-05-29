import { Page,expect } from "@playwright/test";
import { OutletMenuNav } from "../outletMenuNavigation";
// Used to read files, check if file exists, get file details
import * as fs from 'fs';
// Used to join folder paths correctly for any OS
import * as path from 'path';
//Used to get system information
import * as os from 'os';

export class AuditPage{
  /**
     * OutletMenuNav instance — handles sidebar menu and submenu navigation
     * Reused from outletMenuNavigation.ts to avoid code duplication
     */
    outletMenuNav: OutletMenuNav;
   
    constructor(public page:Page){
      //Reuse OutletMenuNav for sidebar navigation
      this.outletMenuNav = new OutletMenuNav(page);
    }
     //****************** Locators ***************/
     // Sidebar main menu items (Home, Administration,outletmanagment,product managemnet )
     homePageMenuItems='//a[contains(@class,"sidebar-link")]//span';

     // Submenu items under OutletManagement (Outlets)
     outletSubMenu='(//a/span[@class="lan-5"])[1]';
     
     //Outlet Management page header (used for validation)
     outletMngPage='//h1[text()="Outlet Management"]';

     //Outlet name link to click and navigate to outlet details
     outletNameText='//a[@class="outlet-name-text mb-1"]';

     //Search input field for outlet name
     searchByOutletNames='//input[@placeholder="Search by name, external id, or location..."]';

     //Created date filter dropdown
     filterDate='//select[@class="input-created-filter-type form-select"]';

     //All dropdown options under created date filter
     selectOptions='//select[@class="input-created-filter-type form-select"]/option';


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
     * Description: This function performs complete audit page operations by:
     *
     * Navigation Steps:
     * 1. Reuses OutletMenuNav to navigate to Outlet Management page
     *    (handles sidebar menu and submenu clicks internally)
     *
     * Search and Filter Steps:
     * 2. Fills search box with outlet name
     * 3. Opens date filter dropdown and selects given filter
     * 4. Clicks outlet name to navigate to outlet details page
     * 5. Clicks Audits tab to navigate to audit section
     *
     * Audit Search Steps:
     * 6.  Loops through all rows on current page to find matching Audit ID
     * 7.  Scrolls to matched row and clicks View button
     * 8.  If not found on current page, clicks Next and repeats search
     *
     * Filter Steps inside Audit Modal:
     * 9.  Clicks Reset All Filters button
     * 10. Opens Filter by Category dropdown
     * 11. Loops through category options to find and select given category
     *
     * Rack and Data Extraction Steps:
     * 12. Gets total number of racks available
     * 13. Loops through each rack and clicks it
     * 14. Fetches rack name for each rack
     * 15. Clicks By Brand link and fetches all brand names
     * 16. Clicks By SKUs link and fetches all SKU names
     *
     * PDF Export Steps:
     * 17. Deletes any existing PDF files for this Audit ID from Downloads folder
     * 18. Clicks Export PDF button and waits for download event
     * 19. Saves downloaded PDF to Downloads folder
     * 20. Verifies PDF file exists with correct name and timestamp
     * 21. Closes the audit details modal after processing
     *
     * @param menu             - Main menu name to click (e.g., "Outlet Management")
     * @param subMenu          - Sub menu name to click (e.g., "Outlets")
     * @param searchOutletName - Outlet name to search (e.g., "Madhuloka liquor")
     * @param filter           - Filter value to select (e.g., "All time")
     * @param targetAuditId    - Audit ID to search for (e.g., "AUD-1756202792595-df67f19d")
     * @param selectCategory   - Category name to select (e.g., "All Categories")
     *
     * Example Usage:
     * await auditsPage('Outlet Management', 'Outlets', 'Madhuloka liquor', 'All time', 'AUD-123', 'All Categories');
     */
async auditsPage(menu:string,subMenu:string,searchOutletName:string,filter:string,targetAuditId: string, selectCategory: string) {
  //Reuse OutletMenuNav to navigate to Outlet Management page
        // This handles sidebar menu click and submenu click internally
      await this.outletMenuNav.outletMenuAndSubMenu(menu, subMenu);
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
