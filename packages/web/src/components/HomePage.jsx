import { useState } from 'react';
import AuroraBackground from './AuroraBackground.jsx';
import Navbar from './Navbar.jsx';
import { FEATURES, MODEL_PROFILES, SAMPLE_PROMPTS } from '../lib/constants.jsx';

const CLI_COMMANDS = [
  ['/help', 'Show all available commands.'],
  ['/model <name>', 'Switch the active AI model.'],
  ['/system <prompt>', 'Set a custom system prompt.'],
  ['/config', 'View the current configuration.'],
  ['/export', 'Save the conversation as Markdown.'],
  ['/clear', 'Clear the terminal conversation.'],
];

export default function HomePage({ onSignIn }) {
  const [inputValue, setInputValue] = useState('');

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && inputValue.trim()) onSignIn();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050a14' }}>
      <AuroraBackground />
      <Navbar onSignIn={onSignIn} onNavigate={scrollToSection} />

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 140,
          paddingBottom: 80,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero section */}
        <section style={{ textAlign: 'center', maxWidth: 760, padding: '0 24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 100,
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#00d4ff',
                animation: 'pulse-glow 2s infinite',
              }}
            />
            <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>
              Open-source · v1.0.0 now available
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 24,
              color: '#e2e8f0',
            }}
          >
            Meet{' '}
            <span
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ff6b6b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              Dawood AI
            </span>
          </h1>

          <p
            style={{
              fontSize: 20,
              lineHeight: 1.65,
              color: '#64748b',
              marginBottom: 48,
              maxWidth: 560,
              margin: '0 auto 48px',
            }}
          >
            A powerful open-source AI assistant for your terminal and browser. Code, automate, create —
            no API key needed.
          </p>

          {/* CTA input */}
          <div style={{ position: 'relative', maxWidth: 620, margin: '0 auto 24px' }}>
            <div
              style={{
                background: 'rgba(12,21,38,0.8)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 20,
                padding: '4px 4px 4px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.05)',
              }}
            >
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Dawood anything..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e2e8f0',
                  fontSize: 16,
                  fontFamily: 'var(--font-ui)',
                  padding: '10px 0',
                }}
              />
              <button
                onClick={onSignIn}
                style={{
                  padding: '12px 24px',
                  borderRadius: 14,
                  border: 'none',
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.85';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Start chatting →
              </button>
            </div>
          </div>

          {/* Quick prompt chips */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 80,
            }}
          >
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setInputValue(p);
                  onSignIn();
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#475569',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Feature cards */}
        <section
          id="features"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            maxWidth: 900,
            width: '100%',
            padding: '0 24px',
            marginBottom: 80,
            scrollMarginTop: 96,
          }}
        >
          {FEATURES.map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="feature-card"
              style={{
                padding: '24px 20px',
                borderRadius: 16,
                background: 'rgba(12,21,38,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                cursor: 'default',
              }}
            >
              <div
                style={{ fontSize: 24, marginBottom: 12, color, fontFamily: 'var(--font-mono)' }}
              >
                {icon}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#e2e8f0',
                  marginBottom: 8,
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </section>

        {/* Model profiles */}
        <section style={{ width: '100%', maxWidth: 900, padding: '0 24px', marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2
              style={{
                margin: '0 0 8px', color: '#e2e8f0', fontFamily: 'var(--font-display)',
                fontSize: 30, fontWeight: 500,
              }}
            >
              Five ways to work with Dawood
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
              Choose the free mode that fits the task. You can switch modes any time in a chat.
            </p>
          </div>
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14,
            }}
          >
            {MODEL_PROFILES.map(({ name, summary, color }) => (
              <article
                key={name}
                style={{
                  padding: '20px 18px', borderRadius: 14, background: 'rgba(12,21,38,0.6)',
                  border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 14px ${color}` }} />
                  <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: 15, fontWeight: 700 }}>{name}</h3>
                </div>
                <p style={{ margin: 0, color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Quick-start documentation */}
        <section
          id="docs"
          style={{ width: '100%', maxWidth: 680, padding: '0 24px', scrollMarginTop: 96 }}
        >
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <h2
              style={{
                margin: '0 0 8px', color: '#e2e8f0', fontFamily: 'var(--font-display)',
                fontSize: 28, fontWeight: 500,
              }}
            >
              Documentation
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
              Start in the browser or install the CLI for terminal conversations.
            </p>
          </div>
          <div
            style={{
              background: '#0a0f1a',
              border: '1px solid rgba(0,212,255,0.12)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                <div
                  key={c}
                  style={{ width: 12, height: 12, borderRadius: '50%', background: c }}
                />
              ))}
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: '#334155',
                }}
              >
                dawood — terminal
              </span>
            </div>
            <div
              style={{
                padding: '20px 24px',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                lineHeight: 2,
              }}
            >
              <div style={{ color: '#334155' }}>$ npm install -g @dawood/cli</div>
              <div style={{ color: '#22c55e' }}>+ @dawood/cli@1.0.0 installed</div>
              <div style={{ color: '#334155', marginTop: 8 }}>$ dawood</div>
              <div style={{ color: '#00d4ff', marginTop: 4 }}>
                {' '}
                Dawood AI Chatbot — Open-Source Terminal AI Agent
              </div>
              <div style={{ color: '#64748b', fontSize: 12 }}> v1.0.0 · MIT License</div>
              <div style={{ marginTop: 12, color: '#475569' }}>
                {'  › '}
                <span
                  className="terminal-cursor"
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 14,
                    background: '#00d4ff',
                    verticalAlign: 'middle',
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16, marginTop: 16,
            }}
          >
            <article
              style={{
                padding: 20, borderRadius: 16, background: 'rgba(12,21,38,0.6)',
                border: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.6,
              }}
            >
              <h3 style={{ margin: '0 0 10px', color: '#e2e8f0', fontSize: 16 }}>Run locally</h3>
              <p style={{ margin: '0 0 14px', color: '#64748b', fontSize: 13 }}>
                Dawood AI needs Node.js 18 or newer. From the project folder, install packages and
                start both the web app and API server.
              </p>
              <pre
                style={{
                  margin: 0, padding: 14, overflowX: 'auto', borderRadius: 10,
                  background: 'rgba(0,0,0,0.3)', color: '#00d4ff', fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                }}
              >{`npm install\nnpm run dev`}</pre>
              <p style={{ margin: '12px 0 0', color: '#475569', fontSize: 12 }}>
                Then open <span style={{ color: '#94a3b8' }}>http://localhost:3000</span>.
              </p>
            </article>

            <article
              style={{
                padding: 20, borderRadius: 16, background: 'rgba(12,21,38,0.6)',
                border: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.6,
              }}
            >
              <h3 style={{ margin: '0 0 10px', color: '#e2e8f0', fontSize: 16 }}>Use the web app</h3>
              <ol style={{ margin: 0, paddingLeft: 20, color: '#64748b', fontSize: 13 }}>
                <li style={{ marginBottom: 8 }}>Select <span style={{ color: '#94a3b8' }}>Sign up free</span> or <span style={{ color: '#94a3b8' }}>Log in</span>.</li>
                <li style={{ marginBottom: 8 }}>Enter your email and add a display name.</li>
                <li>Ask a question, use a suggested prompt, or start a new chat.</li>
              </ol>
              <p style={{ margin: '14px 0 0', color: '#475569', fontSize: 12 }}>
                Your local profile and chats stay in this browser's local storage.
              </p>
            </article>
          </div>

          <article
            style={{
              marginTop: 16, padding: 20, borderRadius: 16, background: 'rgba(12,21,38,0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 style={{ margin: '0 0 6px', color: '#e2e8f0', fontSize: 16 }}>CLI command reference</h3>
            <p style={{ margin: '0 0 14px', color: '#64748b', fontSize: 13 }}>
              Run <span style={{ color: '#00d4ff', fontFamily: 'var(--font-mono)' }}>dawood</span> after installing the CLI, then use these slash commands.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px 24px' }}>
              {CLI_COMMANDS.map(([command, description]) => (
                <div key={command} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <code style={{ color: '#00d4ff', fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {command}
                  </code>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{description}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
