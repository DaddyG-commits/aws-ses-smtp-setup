/**
 * Example: Send email via Amazon SES SMTP using Nodemailer
 * 
 * Install: npm install nodemailer
 * 
 * Set environment variables:
 *   SES_SMTP_USER=your-smtp-username
 *   SES_SMTP_PASS=your-smtp-password
 *   SES_FROM=noreply@yourdomain.com
 *   SES_TO=recipient@example.com
 */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SES_SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
  port: Number(process.env.SES_SMTP_PORT) || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: process.env.SES_FROM || '"Test App" <noreply@example.com>',
    to: process.env.SES_TO || 'recipient@example.com',
    subject: 'Test email from Amazon SES SMTP',
    text: 'Hello! This email was sent using Amazon SES via SMTP.',
    html: '<p>Hello! This email was sent using <strong>Amazon SES</strong> via SMTP.</p>',
  });

  console.log('Message sent successfully');
  console.log('Message ID:', info.messageId);
}

main().catch((err) => {
  console.error('Failed to send email:', err);
  process.exit(1);
});
