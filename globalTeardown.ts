import { FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalTeardown(config: FullConfig) {
    console.log("=== GLOBAL TEARDOWN START ===");
    console.log("ℹ️ All tests complete — sending email report");

    try {
        // ✅ Fixed — points to the correct file
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