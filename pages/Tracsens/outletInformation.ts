import { Page,expect } from "@playwright/test";
import { OutletPage } from "./outletManagement";
export class OutletInformationPage{
      outletPage:OutletPage;
    constructor(public page:Page){
        this.outletPage = new OutletPage(page);
    }

    //******************* Locators ******************/

    // Outlet Information tab link on outlet details page
    outletInformationLink='//span[text()="Outlet Information"]';

    //Outlet name heading on outlet information page
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

    /**
     * Function Name: outletInformation
     * Author: Lakshmi
     * Created Date: 2026-05-27
     * Description: This function fetches all outlet information details by:
     * 1. Clicking the Outlet Information tab
     * 2. Fetching Outlet Name
     * 3. Fetching External ID
     * 4. Fetching System ID
     * 5. Fetching Registered Address
     * 6. Fetching Secondary or Unit address
     * 7. Fetching City or Township
     * 8. Fetching Region or Territory
     * 9. Fetching State or Province
     * 10. Fetching Postal Code
     * 11. Fetching Coordinates (Lat/Lng)
     * 12. Fetching Created Date
     *
     * Parameters: None
     *
     * Example Usage:
     * outletInformation();
     *
     * Outlet Information Tab → Click to navigate to outlet information
     * Outlet Name            → Fetch outlet name
     * External ID            → Fetch external ID
     * System ID              → Fetch system ID
     * Registered Address     → Fetch registered address
     * Secondary/Unit         → Fetch secondary address
     * City/Township          → Fetch city or township
     * Region                 → Fetch region or territory
     * State                  → Fetch state or province
     * Postal Code            → Fetch postal index code
     * Coordinates            → Fetch coordinates lat and lng
     * Created Date           → Fetch outlet created date
     */

    async outletInformation(menu:string,subMenu:string,searchOutletName:string,filter:string){

        await this.outletPage.outletMenuAndSubMenu(menu,subMenu,searchOutletName,filter);
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