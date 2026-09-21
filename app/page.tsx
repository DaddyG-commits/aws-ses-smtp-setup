'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Hello from Amazon SES');
  const [message, setMessage] = useState('This is a test email sent via Amazon SES on Vercel.');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setResult('');

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setStatus('success');
      setResult(`Email sent! Message ID: ${data.messageId}`);
    } catch (err: any) {
      setStatus('error');
      setResult(err.message || 'Something went wrong');
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Amazon SES</h1>
          <p style={styles.subtitle}>Fully functional SMTP · Deployed on Vercel</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            To
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Subject
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Message
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...styles.input, resize: 'vertical' as const }}
            />
          </label>

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              ...styles.button,
              opacity: status === 'loading' ? 0.7 : 1,
              cursor: status === 'loading' ? 'wait' : 'pointer',
            }}
          >
            {status === 'loading' ? 'Sending…' : 'Send Email'}
          </button>
        </form>

        {result && (
          <div
            style={{
              ...styles.result,
              background: status === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              borderColor: status === 'success' ? '#22c55e' : '#ef4444',
              color: status === 'success' ? '#86efac' : '#fca5a5',
            }}
          >
            {result}
          </div>
        )}

        <div style={styles.footer}>
          <p>
            Powered by{' '}
            <a href="https://aws.amazon.com/ses/" target="_blank" rel="noopener">
              Amazon SES
            </a>{' '}
            ·{' '}
            <a href="https://github.com/DaddyG-commits/aws-ses-smtp-setup" target="_blank" rel="noopener">
              GitHub
            </a>
          </p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#94a3b8' }}>
            Add your AWS credentials as environment variables in Vercel
          </p>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: 'rgba(30, 41, 59, 0.85)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: 16,
    padding: 32,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    color: '#cbd5e1',
  },
  input: {
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid rgba(148, 163, 184, 0.25)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#f1f5f9',
    fontSize: 15,
    outline: 'none',
  },
  button: {
    marginTop: 8,
    padding: '14px 20px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
  },
  result: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    border: '1px solid',
    fontSize: 14,
    wordBreak: 'break-all',
  },
  footer: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 13,
    color: '#64748b',
  },
};
