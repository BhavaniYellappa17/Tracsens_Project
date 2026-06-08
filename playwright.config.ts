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

    testDir: './tests/tracsensTest',

    timeout: 180000,

    expect: {
        timeout: 10000,
    },

    fullyParallel: false,
    workers: 1,
    retries: 0,
    forbidOnly: !!process.env.CI,

    reporter: [
        ['list'],
        ['html'],
        ['monocart-reporter', {
            name: 'Tracsens Report',
            outputFile: './monocart-report/index.html'
        }]
    ],

    use: {
        baseURL: 'https://prod.tracsens.com/',
        screenshot: 'only-on-failure',
        video: 'off',
        trace: 'on-first-retry',
        headless: false,

        // ✅ Set proper viewport
        //viewport: { width: 1280, height: 720 },
        viewport:null,

        // ✅ Add navigation and action timeouts
        // Without these, new context sits on about:blank indefinitely
         navigationTimeout: 60000,
         actionTimeout: 30000,

        launchOptions: {
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            slowMo: 1000,
            args: ['--start-maximized']
        },
    },

    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
});