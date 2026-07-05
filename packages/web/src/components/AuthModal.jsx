import { useState } from 'react';
import { OAUTH_PROVIDERS } from '../lib/constants.jsx';

export default function AuthModal({ onClose, onConfirm }) {
  const [provider, setProvider] = useState('google');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    onConfirm({ authProvider: provider, email: email.trim() });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          borderRadius: 24,
          background: 'rgba(12,21,38,0.98)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          padding: '40px 36px',
          animation: 'fadeUp 0.25s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: '#fff',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
            }}
          >
            D
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: 8,
            }}
          >
            Sign in with your account
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
            No API key needed. Sign in with Microsoft, Google, GitHub, or Apple and receive email updates as needed.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label
              style={{
                display: 'block',
                color: '#94a3b8',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
                letterSpacing: '0.06em',
              }}
            >
              SIGN-IN METHOD
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.entries(OAUTH_PROVIDERS).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setProvider(key)}
                  style={{
                    flex: '1 1 48%',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `1px solid ${provider === key ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: provider === key ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                    color: provider === key ? '#00d4ff' : '#94a3b8',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontFamily: 'var(--font-ui)',
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: '#94a3b8',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 6,
                letterSpacing: '0.06em',
              }}
            >
              EMAIL
            </label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: error ? '1px solid rgba(255,107,107,0.5)' : '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                fontSize: 14,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
            {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{error}</p>}
          </div>

          <button
            type="submit"
            style={{
              padding: '13px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Continue with {OAUTH_PROVIDERS[provider].label.split(' ')[2]}
          </button>
        </form>
      </div>
    </div>
  );
}
