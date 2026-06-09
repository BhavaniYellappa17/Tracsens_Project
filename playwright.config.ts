// import { defineConfig } from '@playwright/test';

// export default defineConfig({

//     testDir: './tests/tracsensTest',

//     // Global timeout per test
//     timeout: 180000,

//     expect: {
//         timeout: 10000,
//     },

//     // Run spec files one at a time
//     fullyParallel: false,
//     workers: 1,
//     retries: 0,
//     forbidOnly: !!process.env.CI,

//     reporter: [
//         ['list'],
//         ['html'],
//         ['monocart-reporter', {
//             name: 'Tracsens Report',
//             outputFile: './monocart-report/index.html'
//         }]
//     ],

//     use: {
//         baseURL: 'https://prod.tracsens.com/',
//         screenshot: 'only-on-failure',
//         video: 'retain-on-failure',
//         trace: 'on-first-retry',
//         headless: false,
//         viewport: null,
//         launchOptions: {
//             slowMo: 1000,
//             args: ['--start-maximized']
//         },
//     },

//     projects: [
//         // {
//         //     name: 'chromium',
//         //     use: {
//         //         browserName: 'chromium',
//         //     },
//         // },
//         {
//             name: 'firefox',
//             use: {
//                 browserName: 'firefox',
//             },
//         },
//     ],
// });

import { defineConfig } from '@playwright/test';

export default defineConfig({

    // ==================== TEST CONFIGURATION ====================

    // Directory where test files are located
    testDir: './tests/tracsensTest',

    // Maximum time for each test to run (3 minutes)
    timeout: 180000,

    // Maximum time for expect() assertions
    expect: {
        timeout: 10000,
    },

    // Run tests sequentially — one at a time
    fullyParallel: false,
    workers: 1,
    retries: 0,

    // Prevent test.only from being committed to CI
    forbidOnly: !!process.env.CI,

    // ==================== REPORTERS ====================
    reporter: [
        ['list'],
        ['html'],
        ['monocart-reporter', {
            name: 'Tracsens Report',
            outputFile: './monocart-report/index.html'
        }]
    ],

    // ==================== BROWSER CONFIGURATION ====================
    use: {
        // Base URL for all page.goto() calls
        baseURL: 'https://prod.tracsens.com/',

        // Screenshot only on test failure
        screenshot: 'only-on-failure',

        // Video recording off
        video: 'off',

        // Trace only on first retry
        trace: 'on-first-retry',

        // ✅ Run headless — required for GitHub Actions (no display)
        headless: true,

        // ✅ Use full viewport — null means use browser default
        viewport: null,

        // ✅ Navigation timeout — max time for page navigation
        navigationTimeout: 60000,

        // ✅ Action timeout — max time for click, fill etc
        actionTimeout: 30000,

        // ✅ Launch options — no executablePath for GitHub Actions
        launchOptions: {
            slowMo: 0,
            args: [
                '--start-maximized',
                '--no-sandbox',              // ✅ required for Linux/GitHub Actions
                '--disable-setuid-sandbox',  // ✅ required for Linux/GitHub Actions
                '--disable-dev-shm-usage'    // ✅ prevents memory issues on GitHub Actions
            ]
        },
    },

    // ==================== PROJECTS ====================
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
});