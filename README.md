# AWS SES SMTP Setup + Vercel Demo

Complete guide and a **ready-to-deploy Next.js app** that sends emails via Amazon SES (SMTP or API).

Live demo can be deployed to Vercel in one click.

## Features

- Fully functional Amazon SES sending (SMTP + AWS SDK)
- Beautiful HTML email template
- Next.js form + API route ready for Vercel
- Free-tier guidance (September 2026)
- Examples in Node.js and Python

## Deploy to Vercel

1. Fork or clone this repo
2. Import the project in [Vercel](https://vercel.com/new)
3. Add these **Environment Variables** in the Vercel project settings:

| Variable | Description |
|----------|-------------|
| `SES_FROM_EMAIL` | Your verified SES sender address |
| `AWS_ACCESS_KEY_ID` | IAM user access key with `ses:SendEmail` permission |
| `AWS_SECRET_ACCESS_KEY` | Corresponding secret key |
| `AWS_REGION` | e.g. `us-east-1` |

Alternatively you can use SMTP credentials:

| Variable | Description |
|----------|-------------|
| `SES_FROM_EMAIL` | Verified sender |
| `SES_SMTP_USER` | SES SMTP username |
| `SES_SMTP_PASS` | SES SMTP password |
| `SES_SMTP_HOST` | e.g. `email-smtp.us-east-1.amazonaws.com` |

4. Deploy → open the URL and send a test email

## Local Development

```bash
npm install
cp .env.example .env.local
# fill in the values
npm run dev
```

Open http://localhost:3000

## Can you do it for free?

**Short answer:** Yes for testing / low volume using AWS Free Tier credits.  
**Long-term production:** Extremely cheap (~$0.10–0.16 per 1,000 emails) after free credits run out.

### Current Free Tier Status (as of July–September 2026)
- New AWS accounts get up to **$200 in Free Tier credits** (usable for ~6 months).
- The old SES-specific free tier (3,000 messages/month for 12 months) is **no longer available for new customers** starting July 21, 2026.
- After credits: Pay-as-you-go pricing plans (Essentials / Pro / Enterprise).

Always verify the latest on the [official SES Pricing page](https://aws.amazon.com/ses/pricing/).

## SES Setup Steps (Quick)

1. Create AWS account → open Amazon SES
2. Verify a domain or email address
3. Request production access (exit sandbox)
4. Create either:
   - An IAM user with `AmazonSESFullAccess` (or a tighter policy) → use Access Key + Secret, **or**
   - SMTP credentials from the SES console
5. Add the values as environment variables in Vercel

## Repository Structure

```
├── app/
│   ├── page.tsx          # Frontend form
│   ├── api/send/route.ts # API that sends the email
│   ├── layout.tsx
│   └── globals.css
├── examples/
│   ├── email-template.html
│   ├── nodejs-html-email.js
│   ├── python-html-email.py
│   └── ...
├── package.json
└── README.md
```

## Best Practices

- Keep bounce + complaint rates low
- Always provide a plain-text fallback with HTML emails
- Set billing alarms in AWS
- Never commit real credentials

## Disclaimer

This repository is for educational purposes. Always follow AWS Acceptable Use Policy and anti-spam laws (CAN-SPAM, GDPR, etc.).

---

**Repo:** [DaddyG-commits/aws-ses-smtp-setup](https://github.com/DaddyG-commits/aws-ses-smtp-setup)
