import { useState } from 'react';
import { PROVIDER_DEFAULTS } from '../lib/constants.js';

export default function ApiKeyModal({ onClose, onConfirm }) {
  const [provider, setProvider]   = useState('anthropic');
  const [apiKey, setApiKey]       = useState('');
  const [showKey, setShowKey]     = useState(false);
  const [error, setError]         = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!apiKey.trim()) { setError('Please enter your API key.'); return; }
    onConfirm({ provider, apiKey: apiKey.trim(), model: PROVIDER_DEFAULTS[provider].model });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 440, borderRadius: 24,
          background: 'rgba(12,21,38,0.98)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          padding: '40px 36px',
          animation: 'fadeUp 0.25s ease-out',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)',
          }}>D</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
            color: '#e2e8f0', marginBottom: 8,
          }}>Connect your API key</h2>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
            Your key is stored only in your browser and never sent to any server.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Provider selector */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: '0.06em' }}>
              PROVIDER
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.entries(PROVIDER_DEFAULTS).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setProvider(key)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    border: `1px solid ${provider === key ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: provider === key ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
                    color: provider === key ? '#00d4ff' : '#64748b',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* API key input */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: '0.06em' }}>
              API KEY
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => { setApiKey(e.target.value); setError(''); }}
                placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
                autoFocus
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', borderRadius: 10,
                  border: error ? '1px solid rgba(255,107,107,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)', color: '#e2e8f0',
                  fontSize: 14, fontFamily: 'var(--font-mono)', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { if (!error) e.target.style.borderColor = 'rgba(0,212,255,0.4)'; }}
                onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              <button
                type="button"
                onClick={() => setShowKey(s => !s)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#475569', fontSize: 12, fontFamily: 'var(--font-ui)',
                }}
              >{showKey ? 'Hide' : 'Show'}</button>
            </div>
            {error && <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 4 }}>{error}</p>}
          </div>

          <button
            type="submit"
            style={{
              padding: '13px', borderRadius: 12, border: 'none',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'opacity 0.2s',
              marginTop: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >Start chatting</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, color: '#334155', fontSize: 12, lineHeight: 1.6 }}>
          {provider === 'anthropic'
            ? <><a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: '#00d4ff', textDecoration: 'none' }}>Get an Anthropic key</a> — free tier available</>
            : <><a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: '#00d4ff', textDecoration: 'none' }}>Get an OpenAI key</a> — pay-as-you-go</>
          }
        </p>
      </div>
    </div>
  );
}
