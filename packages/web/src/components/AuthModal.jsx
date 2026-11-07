import { useState } from 'react';

export default function AuthModal({ onClose, onConfirm }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleContinue(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    onConfirm({ authProvider: 'local', email: normalizedEmail });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 460, borderRadius: 24, background: 'rgba(12,21,38,0.98)',
          border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          padding: '40px 36px', animation: 'fadeUp 0.25s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff',
              fontWeight: 700, fontFamily: 'var(--font-mono)',
            }}
          >
            D
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
              color: '#e2e8f0', marginBottom: 8,
            }}
          >
            Continue on this device
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
            Your profile and chats stay in this browser. No email or password is required.
          </p>
        </div>

        <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label
              style={{
                display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600,
                marginBottom: 6, letterSpacing: '0.06em',
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                border: error ? '1px solid rgba(255,107,107,0.5)' : '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: 14,
                fontFamily: 'var(--font-mono)', outline: 'none',
              }}
            />
            {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{error}</p>}
          </div>

          <button
            type="submit"
            style={{
              padding: '13px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
