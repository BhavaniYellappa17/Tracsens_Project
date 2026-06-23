import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
 
// ✅ Debug — verify env values loaded
console.log("ℹ️ EMAIL_USER      :", process.env.EMAIL_USER);
console.log("ℹ️ RECIPIENTS      :", process.env.REPORT_RECIPIENTS);
console.log("ℹ️ AZURE_TENANT_ID :", process.env.AZURE_TENANT_ID ? "✅ loaded" : "❌ missing");
console.log("ℹ️ AZURE_CLIENT_ID :", process.env.AZURE_CLIENT_ID ? "✅ loaded" : "❌ missing");
console.log("ℹ️ AZURE_SECRET    :", process.env.AZURE_CLIENT_SECRET ? "✅ loaded" : "❌ missing");
 
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
 
        // Get access token
        const accessToken = await getAccessToken();
 
        // Read report file and convert to base64
        const reportPath = path.resolve(__dirname, '..', 'monocart-report', 'index.html');
        console.log(`ℹ️ Report path: ${reportPath}`);
 
        if (!fs.existsSync(reportPath)) {
            throw new Error(`❌ Report file not found at: ${reportPath}`);
        }
 
        const reportContent = fs.readFileSync(reportPath);
        const reportBase64 = reportContent.toString('base64');
        const fileName = `Tracsens_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.html`;
        console.log("✅ Report file read successfully");
 
        // Build recipient list
        const recipients = process.env.REPORT_RECIPIENTS!
            .split(',')
            .map(email => ({
                emailAddress: { address: email.trim() }
            }));
 
        // -------------------- STEP 3: Build Email Body --------------------
        const emailBody = {
            message: {
                subject: `Tracsens Playwright Test Report — ${new Date().toLocaleDateString()}`,
                body: {
                    contentType: 'HTML',
                    content: `
                        <h2>Tracsens Playwright Automation Report</h2>
                        <p>Hi Team,</p>
                        <p>Please find the attached test execution report for <b>Tracsens</b>.</p>
                        <table border="1" cellpadding="8" cellspacing="0">
                            <tr>
                                <td><b>Project</b></td>
                                <td>Tracsens Playwright Automation</td>
                            </tr>
                            <tr>
                                <td><b>Executed On</b></td>
                                <td>${new Date().toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><b>Browser</b></td>
                                <td>Chromium (Chrome)</td>
                            </tr>
                            <tr>
                                <td><b>Environment</b></td>
                                <td>https://prod.tracsens.com</td>
                            </tr>
                        </table>
                        <br/>
                        <p>Please find the full HTML report attached.</p>
                        <br/>
                        <p>Regards,</p>
                        <p>Lakshmi</p>
                        <p>QA Automation Engineer</p>
                        <p>Matryxsoft</p>
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
 
        // -------------------- STEP 4: Send via Graph API --------------------
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
 
sendReportEmail();