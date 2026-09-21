/**
 * Send a properly formatted HTML email via Amazon SES SMTP
 * using the email-template.html file.
 *
 * Install: npm install nodemailer
 *
 * Required environment variables:
 *   SES_SMTP_USER
 *   SES_SMTP_PASS
 *   SES_FROM
 *   SES_TO
 *
 * Optional:
 *   SES_SMTP_HOST (default: email-smtp.us-east-1.amazonaws.com)
 *   SES_SMTP_PORT (default: 587)
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
  port: Number(process.env.SES_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
});

async function sendHtmlEmail() {
  // Load the HTML template
  const htmlPath = path.join(__dirname, 'email-template.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Optional: simple variable replacement
  html = html.replace(/{{name}}/g, process.env.RECIPIENT_NAME || 'there');

  const info = await transporter.sendMail({
    from: process.env.SES_FROM || '"Your App" <noreply@yourdomain.com>',
    to: process.env.SES_TO,
    subject: 'Beautiful HTML email from Amazon SES',
    text: 'This is the plain-text fallback. Open this email in an HTML-capable client to see the full design.',
    html: html,
  });

  console.log('HTML email sent successfully');
  console.log('Message ID:', info.messageId);
}

sendHtmlEmail().catch((err) => {
  console.error('Failed to send HTML email:', err.message);
  process.exit(1);
});
