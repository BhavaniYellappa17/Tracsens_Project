import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
 
console.log("ℹ️ EMAIL_USER      :", process.env.EMAIL_USER);
console.log("ℹ️ RECIPIENTS      :", process.env.REPORT_RECIPIENTS);
console.log("ℹ️ AZURE_TENANT_ID :", process.env.AZURE_TENANT_ID ? "✅ loaded" : "❌ missing");
console.log("ℹ️ AZURE_CLIENT_ID :", process.env.AZURE_CLIENT_ID ? "✅ loaded" : "❌ missing");
console.log("ℹ️ AZURE_SECRET    :", process.env.AZURE_CLIENT_SECRET ? "✅ loaded" : "❌ missing");
 
interface TestSummary {total: number;passed: number;failed: number;flaky: number;skipped: number;

}
 
function getTestSummary(): TestSummary {
    const jsonPath = path.resolve(__dirname, '..', 'monocart-report', 'index.json');
    const defaultSummary: TestSummary = { total: 0, passed: 0, failed: 0, flaky: 0, skipped: 0 };
 
    if (!fs.existsSync(jsonPath)) {
        console.log(`⚠️ monocart-report/index.json not found at: ${jsonPath}`);
        return defaultSummary;
    }
 
    try {
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(rawData);
        const summary = data.summary || data;
 
        return {
            total: summary.tests?.value ?? 0,
            passed: summary.passed?.value ?? 0,
            failed: summary.failed?.value ?? 0,
            flaky: summary.flaky?.value ?? 0,
            skipped: summary.skipped?.value ?? 0,
        };
    } catch (err) {
        console.log("⚠️ Failed to parse monocart-report/index.json:", err);
        return defaultSummary;

}
 
function calculatePassRate(summary: TestSummary): string {
    if (summary.total === 0) return "0.0";
    return ((summary.passed / summary.total) * 100).toFixed(1);
}

// ✅ Helper: Get current date/time formatted in IST (Asia/Kolkata),
// regardless of the timezone of the machine actually running this code
// (e.g. local laptop vs GitHub Actions ubuntu-latest runner, which defaults to UTC).
function getISTDateTime(): string {
    return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// ✅ Helper: Get current date only, formatted in IST — used for subject line and filename
function getISTDateOnly(): string {
    return new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
 
// -------------------- STEP 1: Get Azure Token --------------------
async function getAccessToken(): Promise<string> {
    console.log("ℹ️ Fetching Azure access token...");
 
    const url = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
 
    const params = new URLSearchParams({
        client_id:     process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET!,
        scope:         'https://graph.microsoft.com/.default',
        grant_type:    'client_credentials'
    });
 
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });
 
    const data = await response.json() as {
        access_token?: string;
        error?: string;
        error_description?: string
    };
 
    if (!data.access_token) {
        console.log("❌ Token error       :", data.error);
        console.log("❌ Token description :", data.error_description);
        throw new Error(`Failed to get access token: ${data.error}`);
    }
 
    console.log("✅ Azure access token fetched successfully");
    return data.access_token;
}
 
// -------------------- STEP 2: Send Email via Graph API --------------------
async function sendReportEmail() {
    console.log("=== EMAIL REPORT START ===");
 
    try {
        const reportPath = path.resolve(__dirname, '..', 'monocart-report', 'index.html');
        console.log(`ℹ️ Report path: ${reportPath}`);
 
        if (!fs.existsSync(reportPath)) {
            throw new Error(`❌ Report file not found at: ${reportPath}`);
        }
 
        const summary = getTestSummary();
        const passRate = calculatePassRate(summary);
        console.log(`Test Summary — Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Flaky: ${summary.flaky}, Skipped: ${summary.skipped}`);
 
        const accessToken = await getAccessToken();
 
        const reportContent = fs.readFileSync(reportPath);
        const reportBase64 = reportContent.toString('base64');
        const fileName = `Tracsens_Report_${getISTDateOnly().replace(/\//g, '-')}.html`;
        console.log("✅ Report file read successfully");
        console.log(`Report file size: ${reportContent.length} bytes`);
 
        const recipients = process.env.REPORT_RECIPIENTS!.split(',').map(email => ({emailAddress: { address: email.trim() }}));
 
        const overallStatusColor = summary.failed > 0 ? '#dc3545' : '#28a745';
        const overallStatusText = summary.failed > 0 ? 'FAILED' : 'PASSED';
        const overallStatusIcon = summary.failed > 0 ? '✕' : '✓';
 
        const emailBody = {
            message: {
                subject: `[Tracsens Automation] Test Report — ${getISTDateOnly()} — ${overallStatusText}`,
                body: {
                    contentType: 'HTML',
                    content: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background-color: #ffffff;">
 
                        <!-- Header Banner -->
                        <div style="background-color: #1a2b4c; padding: 28px 32px; border-radius: 6px 6px 0 0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <span style="color: #ffffff; font-size: 20px; font-weight: 600;">Tracsens</span>
                                        <span style="color: #8fa3c4; font-size: 14px; margin-left: 8px;">Playwright Automation</span>
                                    </td>
                                    <td align="right">
                                        <span style="background-color: ${overallStatusColor}; color: #ffffff; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 20px; letter-spacing: 0.5px;">
                                            ${overallStatusIcon} ${overallStatusText}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>
 
                        <!-- Body -->
                        <div style="padding: 32px; border: 1px solid #e8eaed; border-top: none;">
 
                            <!-- Intro Block — NOW COLORED -->
                            <div style="background-color: #f0f4fa; border-left: 4px solid #1a2b4c; border-radius: 6px; padding: 16px 20px; margin-bottom: 28px;">
                                <p style="font-size: 15px; color: #1a2b4c; font-weight: 600; margin: 0 0 6px 0;">Hi Team,</p>
                                <p style="font-size: 14px; color: #2c3e50; line-height: 1.6; margin: 0;">
                                    The automated test execution for <b>Tracsens</b> has completed. A summary of the results is below, with the full detailed report attached.
                                </p>
                            </div>
 
                           <!-- Stat Cards Row -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td width="32%" align="center" style="background-color: #f7f9fc; border-radius: 8px; padding: 20px 8px;">
                                        <div style="font-size: 28px; font-weight: 800; color: #1a2b4c;">${summary.total}</div>
                                        <div style="font-size: 12px; font-weight: 700; color: #5a6573; margin-top: 6px; letter-spacing: 0.5px;">TOTAL TESTCASE</div>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="32%" align="center" style="background-color: #eaf7ed; border-radius: 8px; padding: 20px 8px;">
                                        <div style="font-size: 28px; font-weight: 800; color: #1e7e34;">${summary.passed}</div>
                                        <div style="font-size: 12px; font-weight: 700; color: #28a745; margin-top: 6px; letter-spacing: 0.5px;">PASSED</div>
                                    </td>
                                    <td width="2%"></td>
                                    <td width="32%" align="center" style="background-color: #fdeded; border-radius: 8px; padding: 20px 8px;">
                                        <div style="font-size: 28px; font-weight: 800; color: #a71d2a;">${summary.failed}</div>
                                        <div style="font-size: 12px; font-weight: 700; color: #dc3545; margin-top: 6px; letter-spacing: 0.5px;">FAILED</div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Pass Rate Bar -->
                            <div style="margin-bottom: 28px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="font-size: 13px; color: #5a6573; font-weight: 600;">Pass Rate</td>
                                        <td align="right" style="font-size: 13px; color: ${overallStatusColor}; font-weight: 700;">${passRate}%</td>
                                    </tr>
                                </table>
                                <div style="background-color: #eef0f3; border-radius: 6px; height: 8px; margin-top: 6px; overflow: hidden;">
                                    <div style="background-color: ${overallStatusColor}; height: 8px; width: ${passRate}%; border-radius: 6px;"></div>
                                </div>
                            </div>
 
                            <!-- Execution Details -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #eef0f3; padding-top: 4px;">
                                <tr>
                                    <td style="padding: 10px 0; font-size: 13px; color: rgb(1, 1, 32); width: 35%;">Project</td>
                                    <td style="padding: 10px 0; font-size: 13px; color: rgb(1, 1, 32); font-weight: 600;">Tracsens Playwright Automation</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; font-size: 13px; color: rgb(1, 1, 32); border-top: 1px solid #f3f4f6;">Executed On</td>
                                    <td style="padding: 10px 0; font-size: 13px; color: rgb(1, 1, 32); font-weight: 600; border-top: 1px solid #f3f4f6;">${getISTDateTime()} IST</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; font-size: 13px; color: rgb(1, 1, 32); border-top: 1px solid #f3f4f6;">Browser</td>
                                    <td style="padding: 10px 0; font-size: 13px; color: rgb(1, 1, 32); font-weight: 600; border-top: 1px solid #f3f4f6;">Chromium (Chrome)</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; font-size: 13px; color: rgb(1, 1, 32); border-top: 1px solid #f3f4f6;">Environment</td>
                                    <td style="padding: 10px 0; font-size: 13px; color:rgb(1, 1, 32); font-weight: 600; border-top: 1px solid #f3f4f6;">https://prod.tracsens.com</td>
                                </tr>
                            </table>
 
                            <p style="font-size: 13px; color: #02050a; margin: 28px 0 0 0;">
                                📎 The full detailed report is attached to this email.
                            </p>
 
                            <!-- Signature -->
                            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #eef0f3;">
                                <p style="font-size: 13px; color: #02050a; margin: 0 0 2px 0;">Regards,</p>
                                <p style="font-size: 13px; color: #02050a; font-weight: 600; margin: 0;">Bhavani</p>
                                <p style="font-size: 12px; color: #02050a; margin: 2px 0 0 0;">QA Automation Engineer · Matryxsoft Tech</p>
                            </div>
                        </div>
 
                        <!-- Footer -->
                        <div style="text-align: center; padding: 16px; font-size: 11px; color: #a8b0bc;">
                            This is an automated message from the Tracsens Playwright test automation pipeline.
                        </div>
                    </div>
                    `
                },
                toRecipients: recipients,
                attachments: [
                    {
                        '@odata.type': '#microsoft.graph.fileAttachment',
                        name: fileName,
                        contentType: 'text/html',
                        contentBytes: reportBase64
                    }
                ]
            },
            saveToSentItems: true
        };
 
        console.log(`ℹ️ Sending email to: ${process.env.REPORT_RECIPIENTS}`);
 
        const sendUrl = `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_USER}/sendMail`;
 
        const sendResponse = await fetch(sendUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailBody)
        });
 
        if (sendResponse.ok) {
            console.log("✅ Email sent successfully via Microsoft Graph API!");
        } else {
            const errorData = await sendResponse.json() as { error?: { message?: string; code?: string } };
            console.log("❌ Graph API error code    :", errorData?.error?.code);
            console.log("❌ Graph API error message :", errorData?.error?.message);
        }
 
    } catch (error) {
        if (error instanceof Error) {
            console.log(`❌ Email sending failed: ${error.message}`);
        }
    }
 
    console.log("=== EMAIL REPORT END ===");
}

export default sendReportEmail;

// ✅ If this file is run directly (e.g. `npm run send-report` or `ts-node utils/sendReportEmail.ts`),
// execute it immediately. When imported by Playwright's globalTeardown, this block is skipped —
// Playwright calls the exported function itself.
if (require.main === module) {
    sendReportEmail();
}