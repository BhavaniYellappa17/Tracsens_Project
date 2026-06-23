// globalTeardown.ts — lives at project root
import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalTeardown(config: FullConfig) {
    console.log("=== GLOBAL TEARDOWN START ===");
    console.log("ℹ️ All tests complete — sending email report");

    try {
        // ✅ Fixed path — points to utils/sendReportEmail.ts (where your actual script lives)
        execSync('npx ts-node utils/sendReportEmail.ts', { stdio: 'inherit' });
        console.log("✅ Email report sent successfully");
    } catch (error) {
        if (error instanceof Error) {
            console.log(`❌ Failed to send email: ${error.message}`);
        }
    }

    console.log("=== GLOBAL TEARDOWN END ===");
}

export default globalTeardown;