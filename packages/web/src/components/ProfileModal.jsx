import { useState } from 'react';

export default function ProfileModal({ onClose, onConfirm }) {
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Please tell us what to call you.');
      return;
    }
    if (!dob) {
      setError('Please enter your date of birth.');
      return;
    }
    onConfirm({ displayName: displayName.trim(), dob });
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
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#e2e8f0',
              marginBottom: 8,
            }}
          >
            Before chatting...
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
            Tell us what to call you and your date of birth so we can personalize your experience.
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
              WHAT SHOULD WE CALL YOU?
            </label>
            <input
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError('');
              }}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                fontSize: 14,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
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
              DATE OF BIRTH
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0',
                fontSize: 14,
                fontFamily: 'var(--font-mono)',
                outline: 'none',
              }}
            />
          </div>

          {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{error}</p>}

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
            Continue to chat
          </button>
        </form>
      </div>
    </div>
  );
}
