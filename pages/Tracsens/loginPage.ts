import { Page,expect } from "@playwright/test";
export class LoginPage{
    constructor(public page:Page)
    {}
 
    //********************locators*****************
    // Application logo on login page
    logo='//img[contains(@src,"/static/media/")]';
    // //imagefull.71de99ac0ab75829eb8c.gif"]';
    // Username input field
    userName='//input[@type="text"]';
    // Password input field
    password='//input[@type="password"]';
     // Sign In button
    signinButton='//button[text()="Sign In"]';
    homePageMessage='//h2[text()="Intelligence Center"]';
    /**
     * Function Name: openApplication
     * Description: This function opens the application login page by navigating and verify the URL "/login".
     * Author: Lakshmi
     * Created Date: 2026-05-08
     * Example:openApplication()
     */
 
    async openApplication(){
        // Navigate to login page URL
        await this.page.goto('/login');
        await expect(this.page).toHaveTitle(/Tracsens/);
    }
   
    /**
     * Function Name: login
     * Description:Performs login action using username and password.It first checks if the logo is visible before entering credentials.
     * Parameters:
     * @param username - alexxx
     * @param password - passwordxxxx
     * Example:login("admin", "admin123");
     */
 
    async login(username:string,password:string):Promise<void>{
       
        if(username===null || username==="" || password===null || password==="" )
        {
             console.log("Username or Password is missing");
             return;
        }
        // Check if login page is loaded correctly by verifying logo visibility
        if(await this.page.locator(this.logo).isVisible()){
             
            await this.page.locator(this.userName).fill(username);
           
            await this.page.locator(this.password).fill(password);
           
            await this.page.locator(this.signinButton).click();
            await this.page.waitForTimeout(2000);
            if(await this.page.locator(this.homePageMessage).isVisible()){
            console.log("Login was successful");
            }      
            else{
            console.log("Failed to login");
            }
        }
    }
 
         /**
     * Function Name: verifyhomepagetitle
     * Description:Verifies that user has successfully logged in by checking homepage title.
     * Example:verifyHomePageTitle();
     */
        async verifyHomePageTitle(){
            // Validate  title after login
            await this.page.waitForTimeout(2000);
            if(await this.page.locator(this.homePageMessage).isVisible()){
            console.log("HomePage title was visible");
 
        }
        else{
            console.log("HomePage title was not visible");
        }
    }
 
/**
 * Function Name: loginFlow
 * Author: Lakshmi
 * Created Date: 2026-05-12
 * Description:This function performs complete login flow in a single step:-
 * 1. Opens application
 * 2. Verifies login page title
 * 3. Enters username and password
 * 4. Clicks sign in button
 * 5. Verifies home page title after login
 * Example:loginFlow("admin", "admin123");
*/
async loginToApplicationT(username: string, password: string) {
    // Step 1: Open the application
    await this.openApplication();
   // Step 2: Perform login
    await this.login(username, password);
 
}    
}
 
 
 