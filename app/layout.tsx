import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AWS SES SMTP Demo',
  description: 'Send emails via Amazon SES – fully functional SMTP + free-tier guide',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
