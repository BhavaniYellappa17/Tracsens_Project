//Imports the nodemailer library — the tool that actually sends emails using SMTP.
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const archiverModule = require('archiver');
const ZipArchive = archiverModule.ZipArchive;

// ==================== EMAIL CONFIGURATION (OUTLOOK) ====================
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

// ==================== ZIP THE REPORT FOLDER ====================
function zipReport(sourceDir: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err: Error) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

// ==================== SEND EMAIL FUNCTION ====================
async function sendReportEmail() {
  const reportDir = path.join(__dirname, '../playwright-report');
  const zipPath = path.join(__dirname, '../playwright-report.zip');

  await zipReport(reportDir, zipPath);

  const recipients = process.env.REPORT_RECIPIENTS?.split(',') || [];

  if (recipients.length === 0) {
    console.warn('⚠️ No recipients found in .env — email not sent');
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(','),
    subject: `Tracsens Automation Report - ${new Date().toLocaleDateString()}`,
    html: `
      <h2>Tracsens Test Execution Report</h2>
      <p>Hi Team,</p>
      <p>Please find attached the latest automation test report.</p>
      <p><b>Execution Date:</b> ${new Date().toLocaleString()}</p>
      <p>Regards,<br/>Automation Team</p>
    `,
    attachments: [
      {
        filename: 'playwright-report.zip',
        path: zipPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ Report email sent successfully!');
}

sendReportEmail().catch((err: Error) => {
  console.error('❌ Failed to send report email:', err);
});
