// import { test } from '@playwright/test';
// import { LoginPage } from '../pages/Tracsens/loginPage';
// import { LogoutPage } from '../pages/Tracsens/logoutPage';
// import loginData from '../tests/testdata/loginData.json';

// // ==================== PAGE OBJECT INSTANCES ====================

// // LoginPage instance — handles application login flow
// let loginPage: LoginPage;

// // LogoutPage instance — handles application logout flow
// let logout: LogoutPage;

// // Global wait time declarations
// declare global {
//     var giSMALLWAIT: number;
//     var giMEDIUMWAIT: number;
//     var giLARGEWAIT: number;
// }

// // ==================== HOOKS ====================

// /**
//  * @hook beforeEach
//  * @description Runs before every test across all spec files that import this hook.
//  *  1. Sets global wait times based on the browser being used
//  *  2. Navigates to the application base URL
//  *  3. Logs into the application using credentials from loginData.json
//  */
// test.beforeEach(async ({ page, browserName }) => {
//     console.log("=== BEFORE EACH: Setup START ===");

//     // -------------------- INITIALIZATION SECTION --------------------

//     console.log("Initializing Page Object Model instances");
//     loginPage = new LoginPage(page);
//     logout    = new LogoutPage(page);
//     console.log("✅ LoginPage and LogoutPage instances created");

//     // -------------------- GLOBAL WAIT CONFIGURATION SECTION --------------------

//     console.log(`ℹ️ Active browser: "${browserName}"`);
//     if (browserName === 'firefox') {
//         globalThis.giSMALLWAIT  = 2000;
//         globalThis.giMEDIUMWAIT = 4000;
//         globalThis.giLARGEWAIT  = 10000;
//         console.log("ℹ️ Firefox wait times applied");
//     } else {
//         globalThis.giSMALLWAIT  = 2000;
//         globalThis.giMEDIUMWAIT = 4000;
//         globalThis.giLARGEWAIT  = 10000;
//         console.log("ℹ️ Chromium wait times applied");
//     }
//     console.log(`ℹ️ SMALL: ${globalThis.giSMALLWAIT}ms | MEDIUM: ${globalThis.giMEDIUMWAIT}ms | LARGE: ${globalThis.giLARGEWAIT}ms`);

//     // -------------------- NAVIGATION SECTION --------------------

//     // ✅ Use full URL instead of '/' to avoid baseURL resolution issues
//     // between spec files when browser context is recreated
//     console.log("Step 1: Navigating to application URL");
//     await page.goto('https://prod.tracsens.com/login');
//     await page.waitForLoadState('networkidle');
//     console.log("✅ Navigation to application URL complete");

//     // -------------------- LOGIN SECTION --------------------

//     console.log(`Step 2: Logging in with username: "${loginData.username}"`);
//     await loginPage.loginToApplicationT(loginData.username, loginData.password);
//     console.log("✅ Login complete — test starting");

//     console.log("=== BEFORE EACH: Setup END ===");
// });

// /**
//  * @hook afterEach
//  * @description Runs after every test across all spec files that import this hook.
//  * Logs out of the application and handles any logout errors gracefully.
//  */
// test.afterEach(async ({ page }, testInfo) => {
//     console.log("=== AFTER EACH: Teardown START ===");
//     console.log(`ℹ️ Test: "${testInfo.title}" | Status: "${testInfo.status}"`);

//     try {
//         // ✅ Wait for page to settle before logout
//         // Prevents logout from firing while previous test's actions are still running
//         await page.waitForLoadState('networkidle');
//         console.log("✅ Page is idle — proceeding with logout");

//         await logout.logOut();
//         console.log("✅ Logout complete");

//     } catch (error) {
//         if (error instanceof Error) {
//             // ✅ Don't throw — just log and continue to next spec
//             console.log(`⚠️ Logout skipped or failed: ${error.message}`);
//         }
//     }

//     console.log("=== AFTER EACH: Teardown END ===");
// });

import { test } from '@playwright/test';
import { LoginPage } from '../pages/Tracsens/loginPage';
import { LogoutPage } from '../pages/Tracsens/logoutPage';
import loginData from '../tests/testdata/loginData.json';

// ==================== PAGE OBJECT INSTANCES ====================

let loginPage: LoginPage;
let logout: LogoutPage;

declare global {
    var giSMALLWAIT: number;
    var giMEDIUMWAIT: number;
    var giLARGEWAIT: number;
}

// ==================== HOOKS ====================

test.beforeEach(async ({ page, browserName }) => {
    console.log("=== BEFORE EACH: Setup START ===");

    // -------------------- INITIALIZATION SECTION --------------------

    console.log("Initializing Page Object Model instances");
    loginPage = new LoginPage(page);
    logout    = new LogoutPage(page);
    console.log("✅ LoginPage and LogoutPage instances created");

    // -------------------- GLOBAL WAIT CONFIGURATION --------------------

    console.log(`ℹ️ Active browser: "${browserName}"`);
    if (browserName === 'firefox') {
        globalThis.giSMALLWAIT  = 2000;
        globalThis.giMEDIUMWAIT = 4000;
        globalThis.giLARGEWAIT  = 10000;
    } else {
        globalThis.giSMALLWAIT  = 2000;
        globalThis.giMEDIUMWAIT = 4000;
        globalThis.giLARGEWAIT  = 10000;
    }
    console.log(`ℹ️ SMALL: ${globalThis.giSMALLWAIT}ms | MEDIUM: ${globalThis.giMEDIUMWAIT}ms | LARGE: ${globalThis.giLARGEWAIT}ms`);

    // -------------------- NAVIGATION SECTION --------------------

    console.log("Step 1: Navigating to application login page");

    // ✅ Retry goto up to 3 times in case new browser context
    // is not ready yet when switching between spec files
    let navigated = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`ℹ️ Navigation attempt ${attempt} of 3`);
            // await page.goto('https://prod.tracsens.com/login', {
            //     waitUntil: 'domcontentloaded',
            //     timeout: 30000
            // });
            await page.goto('/login', {waitUntil: 'domcontentloaded',timeout: 30000});
            // ✅ Confirm the URL actually changed from about:blank
            //await page.waitForURL('**/login', { timeout: 30000 });
            console.log(`✅ Navigation successful on attempt ${attempt}`);
            navigated = true;
            break;
        } catch (error) {
            console.log(`⚠️ Navigation attempt ${attempt} failed — retrying in 2s`);
            await page.waitForTimeout(2000);
        }
    }

    if (!navigated) {
        throw new Error('❌ Failed to navigate to login page after 3 attempts');
    }

    // ✅ Wait for page to be fully loaded before login
    //await page.waitForLoadState('networkidle');
    console.log("✅ Page fully loaded — ready for login");

    // -------------------- LOGIN SECTION --------------------

    console.log(`Step 2: Logging in with username: "${loginData.validLogin}"`);
    await loginPage.loginToApplicationT(loginData.validLogin.username, loginData.validLogin.password);
    console.log("✅ Login complete — test starting");

    console.log("=== BEFORE EACH: Setup END ===");
});

test.afterEach(async ({ page },testInfo) => {
    console.log("=== AFTER EACH: Teardown START ===");
    console.log(`ℹ️ Test: "${testInfo.title}" | Status: "${testInfo.status}"`);

    try {
        await page.waitForLoadState('networkidle');
        console.log("✅ Page is idle — proceeding with logout");

        await logout.logOut();
        console.log("✅ Logout complete");

        // ✅ Wait for logout navigation to fully complete
        // before Playwright closes this context and opens next spec
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        console.log("✅ Post-logout settle complete — ready for next spec");

    } catch (error) {
        if (error instanceof Error) {
            console.log(`⚠️ Logout skipped or failed: ${error.message}`);
        }
    }

    console.log("=== AFTER EACH: Teardown END ===");
});