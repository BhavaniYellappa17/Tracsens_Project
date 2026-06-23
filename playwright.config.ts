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
    // Triggers after ALL tests finish — sends email report
    //globalTeardown: require.resolve('./globalTeardown.ts'),

    // ==================== TEST CONFIGURATION ====================

    // Directory where test files are located
    testDir: './tests/tracsensTest',

    // ✅ Increased to 5 minutes for CI environment
    timeout: 300000,

    // ✅ Increased expect timeout for CI
    expect: {
        timeout: 30000,
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
        video: 'retain-on-failure',

        // Trace only on first retry
        trace: 'on-first-retry',

        // ✅ Run headless — required for GitHub Actions (no display)
        headless: false,

        // ✅ Fixed viewport for CI — null causes issues on GitHub Actions
        //viewport: { width: 1920, height: 1080 },
        viewport:null,


        // ✅ Increased navigation timeout for CI environment
        navigationTimeout: 120000,

        // ✅ Increased action timeout for CI environment
        actionTimeout: 60000,

        // ✅ Launch options for GitHub Actions Linux environment
        launchOptions: {
            slowMo: 0,
            args: [
            '--start-maximized',        
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
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