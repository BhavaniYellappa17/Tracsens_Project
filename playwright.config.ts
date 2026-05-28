import { defineConfig } from '@playwright/test';

export default defineConfig({

    testDir: './tests',

    // Global timeout per test
    timeout: 180000,

    expect: {
        timeout: 10000,
    },

    // Run spec files one at a time
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
        // ✅ Add trailing slash to baseURL
        baseURL: 'https://prod.tracsens.com/',

        // Screenshots
        screenshot: 'only-on-failure',

        // ✅ Change video from 'on' to 'retain-on-failure'
        // 'on' keeps browser context open between specs causing about:blank
        video: 'retain-on-failure',

        // Trace
        trace: 'on-first-retry',

        // Browser visible
        headless: false,

        // ✅ Set proper viewport
        viewport: { width: 1280, height: 720 },

        // ✅ Add navigation and action timeouts
        // Without these, new context sits on about:blank indefinitely
         navigationTimeout: 60000,
         actionTimeout: 30000,

        launchOptions: {
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