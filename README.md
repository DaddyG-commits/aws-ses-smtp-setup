# AWS SES SMTP Setup Guide

Complete, up-to-date guide (September 2026) to set up a **fully functional Amazon SES SMTP** service, including free-tier guidance and **HTML email** support.

## Can you do it for free?

**Short answer:** Yes for testing / low volume using AWS Free Tier credits.  
**Long-term production:** Extremely cheap (~$0.10–0.16 per 1,000 emails) after free credits run out.

### Current Free Tier Status (as of July–September 2026)
- New AWS accounts get up to **$200 in Free Tier credits** (usable for ~6 months).
- The old SES-specific free tier (3,000 messages/month for 12 months) is **no longer available for new customers** starting July 21, 2026.
- After credits: Pay-as-you-go pricing plans (Essentials / Pro / Enterprise).

Always verify the latest on the [official SES Pricing page](https://aws.amazon.com/ses/pricing/).

## Quick Start Checklist

1. [Create AWS Account](https://portal.aws.amazon.com/billing/signup) (use free plan if available)
2. Open **Amazon SES** console
3. Verify a domain or email address
4. Request production access (exit sandbox)
5. Create SMTP credentials
6. Test sending (including HTML emails)

## Step-by-Step Setup

### 1. Create / Sign in to AWS Account
- Go to [aws.amazon.com](https://aws.amazon.com) → Create account
- Choose the free plan if offered
- Complete identity verification (phone + payment method is usually required even on free tier)

### 2. Open Amazon SES
1. Search for **SES** or **Simple Email Service** in the AWS Console
2. Select a region close to your users (e.g. `us-east-1`, `eu-west-1`)

### 3. Verify Identities
**Option A – Domain (recommended for production)**
1. Go to **Verified identities** → **Create identity** → Domain
2. Enter your domain
3. Add the DNS records (DKIM + optional SPF/DMARC) shown in the console to your DNS provider
4. Wait for verification (usually minutes to a few hours)

**Option B – Single Email Address (quick testing)**
1. Create identity → Email address
2. Click the verification link sent to that address

### 4. Exit the Sandbox (Critical)
New accounts start in **sandbox mode**:
- Max 200 emails / 24h
- Max 1 email / second
- Can only send to verified addresses

**Request production access:**
1. In SES console → Account dashboard → Request production access
2. Or use Service Quotas
3. Fill the form honestly (use case, expected volume, website, how you handle bounces/complaints)
4. Approval usually takes 1–3 business days

### 5. Create SMTP Credentials
1. SES console → **SMTP settings** (left sidebar)
2. Click **Create SMTP credentials**
3. Give the IAM user a name (e.g. `ses-smtp-user`)
4. Download the credentials (SMTP username + password)

> Important: These are **not** the same as regular AWS access keys.

### 6. SMTP Settings to Use

| Setting              | Value                                      |
|----------------------|--------------------------------------------|
| Host                 | `email-smtp.<region>.amazonaws.com`        |
| Port                 | 587 (STARTTLS) or 465 (TLS)                |
| Encryption           | STARTTLS or TLS                            |
| Authentication       | Yes                                        |
| Username             | (from SMTP credentials)                    |
| Password             | (from SMTP credentials)                    |

**Common endpoints:**
- US East (N. Virginia): `email-smtp.us-east-1.amazonaws.com`
- Europe (Ireland): `email-smtp.eu-west-1.amazonaws.com`
- Asia Pacific (Sydney): `email-smtp.ap-southeast-2.amazonaws.com`

Full list: [AWS General Reference – SES endpoints](https://docs.aws.amazon.com/general/latest/gr/ses.html)

## HTML Email Support

This repository includes a clean, responsive HTML email template and ready-to-run scripts.

### Files
- `examples/email-template.html` – Beautiful, mobile-friendly HTML email template
- `examples/nodejs-html-email.js` – Node.js script that loads the template and sends it
- `examples/python-html-email.py` – Python equivalent

### Quick test (Node.js)
```bash
cd examples
npm install
export SES_SMTP_USER=...
export SES_SMTP_PASS=...
export SES_FROM=noreply@yourdomain.com
export SES_TO=you@example.com
node nodejs-html-email.js
```

### Quick test (Python)
```bash
export SES_SMTP_USER=...
export SES_SMTP_PASS=...
export SES_FROM=noreply@yourdomain.com
export SES_TO=you@example.com
python examples/python-html-email.py
```

The template uses inline CSS and table-friendly structure so it renders well across Gmail, Outlook, Apple Mail, etc.

## Example Code (Plain + HTML)

### Node.js (Nodemailer – simple version)
```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
});

async function sendTest() {
  const info = await transporter.sendMail({
    from: '"Your App" <noreply@yourdomain.com>',
    to: 'recipient@example.com',
    subject: 'Hello from SES',
    text: 'This is a test email sent via Amazon SES SMTP.',
    html: '<b>This is a test email sent via Amazon SES SMTP.</b>',
  });
  console.log('Message sent:', info.messageId);
}

sendTest().catch(console.error);
```

### Python
```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

msg = MIMEMultipart('alternative')
msg['From'] = 'noreply@yourdomain.com'
msg['To'] = 'recipient@example.com'
msg['Subject'] = 'Hello from SES'

text = 'This is a test email sent via Amazon SES SMTP.'
html = '<b>This is a test email sent via Amazon SES SMTP.</b>'

msg.attach(MIMEText(text, 'plain'))
msg.attach(MIMEText(html, 'html'))

server = smtplib.SMTP('email-smtp.us-east-1.amazonaws.com', 587)
server.starttls()
server.login(os.environ['SES_SMTP_USER'], os.environ['SES_SMTP_PASS'])
server.send_message(msg)
server.quit()
print('Email sent successfully')
```

## Best Practices

- Always set up **bounce** and **complaint** handling (SNS topics or configuration sets)
- Monitor your **reputation** metrics in the SES console
- Use **Configuration Sets** for tracking opens/clicks if needed
- Keep bounce + complaint rates very low (< 5% and < 0.1% ideally)
- Never buy email lists – only send to people who opted in
- Consider **Virtual Deliverability Manager** once you scale
- For HTML emails: keep CSS inline, avoid heavy JavaScript, and always provide a plain-text fallback

## Cost Control

1. Set a **billing alarm** in AWS Budgets / CloudWatch
2. Start with the Essentials plan
3. Watch the free credits balance
4. After free tier → SES is still one of the cheapest high-deliverability SMTP options available

## Repository Contents

- `README.md` – this guide
- `examples/email-template.html` – responsive HTML email template
- `examples/nodejs-html-email.js` – send the HTML template (Node)
- `examples/python-html-email.py` – send the HTML template (Python)
- `examples/nodejs-nodemailer.js` – simple Node example
- `examples/python-smtplib.py` – simple Python example
- `.env.example` – environment variable template

## Disclaimer

This repository is for educational purposes. Always follow AWS Acceptable Use Policy and anti-spam laws (CAN-SPAM, GDPR, etc.). Misuse can result in account suspension.

---

**Created:** September 2026  
**Repo:** [DaddyG-commits/aws-ses-smtp-setup](https://github.com/DaddyG-commits/aws-ses-smtp-setup)
