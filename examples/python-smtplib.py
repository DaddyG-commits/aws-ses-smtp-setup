#!/usr/bin/env python3
"""
Example: Send email via Amazon SES SMTP using Python smtplib

Set environment variables:
  SES_SMTP_USER=your-smtp-username
  SES_SMTP_PASS=your-smtp-password
  SES_FROM=noreply@yourdomain.com
  SES_TO=recipient@example.com
  SES_SMTP_HOST=email-smtp.us-east-1.amazonaws.com  (optional)
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email():
    smtp_host = os.environ.get('SES_SMTP_HOST', 'email-smtp.us-east-1.amazonaws.com')
    smtp_port = int(os.environ.get('SES_SMTP_PORT', 587))
    smtp_user = os.environ['SES_SMTP_USER']
    smtp_pass = os.environ['SES_SMTP_PASS']
    from_addr = os.environ.get('SES_FROM', 'noreply@example.com')
    to_addr = os.environ.get('SES_TO', 'recipient@example.com')

    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Test email from Amazon SES SMTP'
    msg['From'] = from_addr
    msg['To'] = to_addr

    text = 'Hello! This email was sent using Amazon SES via SMTP.'
    html = '<p>Hello! This email was sent using <strong>Amazon SES</strong> via SMTP.</p>'

    msg.attach(MIMEText(text, 'plain'))
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)

    print('Email sent successfully')

if __name__ == '__main__':
    try:
        send_email()
    except KeyError as e:
        print(f'Missing required environment variable: {e}')
    except Exception as e:
        print(f'Failed to send email: {e}')
