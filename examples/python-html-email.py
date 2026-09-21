#!/usr/bin/env python3
"""
Send a properly formatted HTML email via Amazon SES SMTP
using the email-template.html file.

Required environment variables:
  SES_SMTP_USER
  SES_SMTP_PASS
  SES_FROM
  SES_TO

Optional:
  SES_SMTP_HOST (default: email-smtp.us-east-1.amazonaws.com)
  SES_SMTP_PORT (default: 587)
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

def send_html_email():
    smtp_host = os.environ.get('SES_SMTP_HOST', 'email-smtp.us-east-1.amazonaws.com')
    smtp_port = int(os.environ.get('SES_SMTP_PORT', 587))
    smtp_user = os.environ['SES_SMTP_USER']
    smtp_pass = os.environ['SES_SMTP_PASS']
    from_addr = os.environ.get('SES_FROM', 'noreply@example.com')
    to_addr = os.environ['SES_TO']

    # Load HTML template
    template_path = Path(__file__).parent / 'email-template.html'
    with open(template_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Optional simple replacement
    html_content = html_content.replace('{{name}}', os.environ.get('RECIPIENT_NAME', 'there'))

    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Beautiful HTML email from Amazon SES'
    msg['From'] = from_addr
    msg['To'] = to_addr

    # Plain text fallback
    text = 'This is the plain-text fallback. Open this email in an HTML-capable client to see the full design.'
    msg.attach(MIMEText(text, 'plain'))
    msg.attach(MIMEText(html_content, 'html'))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)

    print('HTML email sent successfully')

if __name__ == '__main__':
    try:
        send_html_email()
    except KeyError as e:
        print(f'Missing required environment variable: {e}')
    except Exception as e:
        print(f'Failed to send email: {e}')
