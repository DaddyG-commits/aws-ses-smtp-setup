import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function getSesClient() {
  return new SESClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });
}

async function sendWithSdk(to: string, subject: string, message: string) {
  const from = process.env.SES_FROM_EMAIL;
  if (!from) throw new Error('SES_FROM_EMAIL is not set');

  const client = getSesClient();

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #ff9900, #ec7211); padding: 28px 40px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 22px;">Amazon SES</h1>
          </div>
          <div style="padding: 36px 40px;">
            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #3f3f46; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p style="margin-top: 28px; font-size: 13px; color: #71717a;">
              Sent via Amazon SES · Deployed on Vercel
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const command = new SendEmailCommand({
    Source: from,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Text: { Data: message, Charset: 'UTF-8' },
        Html: { Data: html, Charset: 'UTF-8' },
      },
    },
  });

  const result = await client.send(command);
  return result.MessageId;
}

async function sendWithSmtp(to: string, subject: string, message: string) {
  const host = process.env.SES_SMTP_HOST || `email-smtp.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`;
  const user = process.env.SES_SMTP_USER;
  const pass = process.env.SES_SMTP_PASS;
  const from = process.env.SES_FROM_EMAIL;

  if (!user || !pass || !from) {
    throw new Error('SES_SMTP_USER, SES_SMTP_PASS and SES_FROM_EMAIL are required for SMTP mode');
  }

  const transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: message,
    html: `<p style="white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`,
  });

  return info.messageId;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'to, subject and message are required' }, { status: 400 });
    }

    // Prefer AWS SDK if access keys are present, otherwise fall back to SMTP
    const useSdk = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

    const messageId = useSdk
      ? await sendWithSdk(to, subject, message)
      : await sendWithSmtp(to, subject, message);

    return NextResponse.json({ success: true, messageId });
  } catch (err: any) {
    console.error('Send error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
