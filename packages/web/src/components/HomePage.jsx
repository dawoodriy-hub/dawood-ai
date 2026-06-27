import { useState } from 'react';
import AuroraBackground from './AuroraBackground.jsx';
import Navbar from './Navbar.jsx';
import { FEATURES, SAMPLE_PROMPTS } from '../lib/constants.js';

export default function HomePage({ onSignIn }) {
  const [inputValue, setInputValue] = useState('');

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputValue.trim()) onSignIn();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050a14' }}>
      <AuroraBackground />
      <Navbar onSignIn={onSignIn} />

      <main style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 140, paddingBottom: 80, position: 'relative', zIndex: 1,
      }}>
        {/* Hero section */}
        <section style={{ textAlign: 'center', maxWidth: 760, padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
            marginBottom: 32,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>Open-source · v1.0.0 now available</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 7vw, 80px)',
            fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em',
            marginBottom: 24, color: '#e2e8f0',
          }}>
            Meet{' '}
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ff6b6b 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%', animation: 'shimmer 4s linear infinite',
            }}>Dawood AI</span>
          </h1>

          <p style={{
            fontSize: 20, lineHeight: 1.65, color: '#64748b',
            marginBottom: 48, maxWidth: 560, margin: '0 auto 48px',
          }}>
            A powerful open-source AI agent for your terminal and browser.
            Code, automate, create — with your own API key.
          </p>

          {/* CTA input */}
          <div style={{ position: 'relative', maxWidth: 620, margin: '0 auto 24px' }}>
            <div style={{
              background: 'rgba(12,21,38,0.8)',
              border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20,
              padding: '4px 4px 4px 24px',
              display: 'flex', alignItems: 'center', gap: 12,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.05)',
            }}>
              <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Dawood anything..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#e2e8f0', fontSize: 16, fontFamily: 'var(--font-ui)', padding: '10px 0',
                }}
              />
              <button
                onClick={onSignIn}
                style={{
                  padding: '12px 24px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  whiteSpace: 'nowrap', transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >Start chatting →</button>
            </div>
          </div>

          {/* Quick prompt chips */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
            {SAMPLE_PROMPTS.map(p => (
              <button key={p} onClick={() => { setInputValue(p); onSignIn(); }} style={{
                padding: '6px 14px', borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                color: '#475569', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >{p}</button>
            ))}
          </div>
        </section>

        {/* Feature cards */}
        <section style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16, maxWidth: 900, width: '100%', padding: '0 24px', marginBottom: 80,
        }}>
          {FEATURES.map(({ icon, title, desc, color }) => (
            <div key={title} className="feature-card" style={{
              padding: '24px 20px', borderRadius: 16,
              background: 'rgba(12,21,38,0.6)', border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)', cursor: 'default',
            }}>
              <div style={{ fontSize: 24, marginBottom: 12, color, fontFamily: 'var(--font-mono)' }}>{icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 8, letterSpacing: '-0.01em' }}>{title}</div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </section>

        {/* Terminal preview */}
        <section style={{ width: '100%', maxWidth: 680, padding: '0 24px' }}>
          <div style={{
            background: '#0a0f1a', border: '1px solid rgba(0,212,255,0.12)',
            borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'center', gap: 8,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#334155' }}>
                dawood — terminal
              </span>
            </div>
            <div style={{ padding: '20px 24px', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2 }}>
              <div style={{ color: '#334155' }}>$ npm install -g @dawood/cli</div>
              <div style={{ color: '#22c55e' }}>+ @dawood/cli@1.0.0 installed</div>
              <div style={{ color: '#334155', marginTop: 8 }}>$ dawood</div>
              <div style={{ color: '#00d4ff', marginTop: 4 }}>  Dawood AI Chatbot — Open-Source Terminal AI Agent</div>
              <div style={{ color: '#64748b', fontSize: 12 }}>  v1.0.0 · MIT License</div>
              <div style={{ marginTop: 12, color: '#475569' }}>
                {'  › '}<span className="terminal-cursor" style={{
                  display: 'inline-block', width: 8, height: 14,
                  background: '#00d4ff', verticalAlign: 'middle',
                }} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
