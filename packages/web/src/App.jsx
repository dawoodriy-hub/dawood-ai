import { useState, useRef, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDERS = {
  google: {
    label: 'Continue with Google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  microsoft: {
    label: 'Continue with Microsoft',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
        <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
        <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
        <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
      </svg>
    ),
  },
  github: {
    label: 'Continue with GitHub',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  apple: {
    label: 'Continue with Apple',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
};

const FEATURES = [
  {
    icon: '⬡',
    title: 'Code & Debug',
    desc: 'Write, review, and fix code across every language and framework.',
    color: '#00d4ff',
  },
  {
    icon: '⚡',
    title: 'Automate',
    desc: 'Build workflows, scripts, and agents that handle repetitive tasks.',
    color: '#7c3aed',
  },
  {
    icon: '✦',
    title: 'Create',
    desc: 'Draft documents, emails, strategies, and creative content instantly.',
    color: '#ff6b6b',
  },
  {
    icon: '◎',
    title: 'Analyse',
    desc: 'Process data, extract insights, and reason through complex problems.',
    color: '#f59e0b',
  },
];

const SAMPLE_CONVERSATIONS = [
  "Explain how neural networks learn",
  "Write a REST API in Node.js",
  "Review my Python code for bugs",
  "Plan a microservices architecture",
  "Draft a technical blog post",
];

// ─────────────────────────────────────────────────────────────────────────────
// Background Aurora
// ─────────────────────────────────────────────────────────────────────────────

function AuroraBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
    }}>
      {/* Blob 1 – cyan */}
      <div className="aurora-1" style={{
        position: 'absolute', width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)',
        top: '-200px', left: '-150px',
        filter: 'blur(60px)',
      }} />
      {/* Blob 2 – violet */}
      <div className="aurora-2" style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
        top: '20%', right: '-100px',
        filter: 'blur(80px)',
      }} />
      {/* Blob 3 – coral */}
      <div className="aurora-3" style={{
        position: 'absolute', width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)',
        bottom: '-100px', left: '30%',
        filter: 'blur(70px)',
      }} />
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────

function Navbar({ onSignIn }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: 64,
      background: 'rgba(5,10,20,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,212,255,0.08)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff',
          fontFamily: 'var(--font-mono)',
        }}>D</div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20, fontWeight: 600,
          background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Dawood AI</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {['Features', 'Docs', 'GitHub', 'Terminal'].map(l => (
          <a key={l} href="#" style={{
            color: '#64748b', textDecoration: 'none', fontSize: 14,
            fontWeight: 500, letterSpacing: '0.02em',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#e2e8f0'}
          onMouseLeave={e => e.target.style.color = '#64748b'}
          >{l}</a>
        ))}
      </div>

      {/* Auth buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onSignIn}
          style={{
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            border: '1px solid rgba(0,212,255,0.3)',
            background: 'transparent',
            color: '#00d4ff', fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.background = 'rgba(0,212,255,0.1)'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; }}
        >Log in</button>
        <button
          onClick={onSignIn}
          style={{
            padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
            border: 'none',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            color: '#fff', fontSize: 14, fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            transition: 'all 0.2s',
            boxShadow: '0 4px 20px rgba(0,212,255,0.25)',
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 8px 30px rgba(0,212,255,0.4)'; }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,212,255,0.25)'; }}
        >Sign up free</button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth Modal
// ─────────────────────────────────────────────────────────────────────────────

function AuthModal({ onClose, onSignedIn }) {
  const [loading, setLoading] = useState(null);

  const handleAuth = (provider) => {
    setLoading(provider);
    setTimeout(() => {
      setLoading(null);
      onSignedIn({ name: 'Dawood', provider });
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 420, borderRadius: 24,
          background: 'rgba(12,21,38,0.95)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)',
          padding: '40px 36px',
          animation: 'fadeUp 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: '#fff', fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}>D</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26, fontWeight: 700,
            color: '#e2e8f0', marginBottom: 8,
          }}>Welcome to Dawood AI</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            Sign in to start your conversation
          </p>
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(PROVIDERS).map(([key, { label, icon }]) => (
            <button
              key={key}
              className="auth-btn"
              onClick={() => handleAuth(key)}
              disabled={loading !== null}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 18px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e2e8f0', fontSize: 15, fontWeight: 500,
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-ui)',
                opacity: loading !== null && loading !== key ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading === key ? (
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderTopColor: '#00d4ff',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ color: '#334155', fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email address"
          style={{
            width: '100%', padding: '13px 16px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            color: '#e2e8f0', fontSize: 14,
            fontFamily: 'var(--font-ui)',
            outline: 'none',
          }}
          onFocus={e => e.target.style.border = '1px solid rgba(0,212,255,0.4)'}
          onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.08)'}
        />
        <button
          style={{
            width: '100%', marginTop: 10, padding: '13px', borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.9'}
          onMouseLeave={e => e.target.style.opacity = '1'}
          onClick={() => handleAuth('email')}
        >Continue with email</button>

        <p style={{
          textAlign: 'center', marginTop: 20,
          color: '#334155', fontSize: 12, lineHeight: 1.6,
        }}>
          By continuing, you agree to our{' '}
          <a href="#" style={{ color: '#00d4ff', textDecoration: 'none' }}>Terms</a>
          {' '}and{' '}
          <a href="#" style={{ color: '#00d4ff', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chat Interface
// ─────────────────────────────────────────────────────────────────────────────

function ChatPage({ user, onSignOut }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello${user?.name ? `, ${user.name}` : ''}! I'm Dawood AI. I can help you write code, debug issues, explain concepts, automate workflows, and much more. What would you like to explore today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    // Simulate streaming response
    const responses = [
      "That's a great question! Let me help you with that.\n\nHere's a clear breakdown:\n\n```javascript\n// Example code\nconst result = await fetch('/api/data');\nconst data = await result.json();\nconsole.log(data);\n```\n\nThis pattern ensures non-blocking I/O while keeping your code readable.",
      "Absolutely! Here's how I'd approach this:\n\n**Step 1:** Understand the requirements\n**Step 2:** Design the architecture\n**Step 3:** Implement with clean, testable code\n\nWould you like me to dive deeper into any of these steps?",
      "Great choice! This is a common pattern in modern software development. The key insight is that by separating concerns, you make your codebase far more maintainable and testable over time.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    let i = 0;
    let current = '';

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    const interval = setInterval(() => {
      if (i < response.length) {
        current += response[i];
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: current };
          return updated;
        });
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
  }, [input, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: 'var(--font-ui)',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 260, flexShrink: 0,
        background: 'rgba(5,10,20,0.95)',
        borderRight: '1px solid rgba(0,212,255,0.08)',
        display: 'flex', flexDirection: 'column',
        padding: '16px 12px',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', marginBottom: 20 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)',
          }}>D</div>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
            background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Dawood AI</span>
        </div>

        {/* New chat */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 10,
          border: '1px solid rgba(0,212,255,0.2)',
          background: 'rgba(0,212,255,0.06)',
          color: '#00d4ff', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-ui)',
          marginBottom: 16, transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = 'rgba(0,212,255,0.12)'}
        onMouseLeave={e => e.target.style.background = 'rgba(0,212,255,0.06)'}
        >
          <span style={{ fontSize: 16 }}>+</span> New chat
        </button>

        {/* Recent */}
        <div style={{ color: '#334155', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>RECENT</div>
        {SAMPLE_CONVERSATIONS.map((title, i) => (
          <button key={i} style={{
            display: 'flex', alignItems: 'center',
            padding: '9px 12px', borderRadius: 8,
            border: 'none', background: i === 0 ? 'rgba(0,212,255,0.08)' : 'transparent',
            color: i === 0 ? '#e2e8f0' : '#64748b',
            fontSize: 13, cursor: 'pointer', textAlign: 'left',
            fontFamily: 'var(--font-ui)', width: '100%',
            transition: 'all 0.2s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}}
          onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}}
          >{title}</button>
        ))}

        {/* User */}
        <div style={{ marginTop: 'auto', padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>{user?.name?.[0] || 'D'}</div>
            <div>
              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{user?.name || 'User'}</div>
              <div style={{ color: '#334155', fontSize: 11 }}>Free plan</div>
            </div>
            <button onClick={onSignOut} style={{
              marginLeft: 'auto', padding: '4px 8px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent', color: '#334155',
              fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}>Out</button>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: '#050a14', overflow: 'hidden',
      }}>
        {/* Top bar */}
        <div style={{
          padding: '16px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <select style={{
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            color: '#94a3b8', fontSize: 13,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            outline: 'none',
          }}>
            <option>dawood-sonnet (default)</option>
            <option>dawood-opus</option>
            <option>dawood-haiku</option>
          </select>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '32px',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'message-in 0.3s ease-out',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0, marginTop: 2,
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)',
                }}>D</div>
              )}
              <div style={{
                maxWidth: '72%', padding: '14px 18px', borderRadius: 16,
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                color: '#e2e8f0', fontSize: 15, lineHeight: 1.7,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                fontFamily: msg.content.includes('```') ? 'var(--font-ui)' : 'var(--font-ui)',
              }}>{msg.content}
                {isTyping && i === messages.length - 1 && msg.role === 'assistant' && msg.content === '' && (
                  <span className="terminal-cursor" style={{
                    display: 'inline-block', width: 2, height: '1em',
                    background: '#00d4ff', verticalAlign: 'middle', marginLeft: 2,
                  }} />
                )}
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length - 1]?.content !== '' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)',
              }}>D</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#00d4ff',
                    animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite`,
                    opacity: 0.6,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '20px 32px 28px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(12,21,38,0.8)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 16,
            boxShadow: '0 0 40px rgba(0,212,255,0.05)',
            backdropFilter: 'blur(20px)',
            transition: 'border-color 0.2s',
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Dawood AI..."
              rows={1}
              style={{
                width: '100%', padding: '16px 60px 16px 20px',
                background: 'transparent', border: 'none', outline: 'none',
                color: '#e2e8f0', fontSize: 15, lineHeight: 1.6,
                fontFamily: 'var(--font-ui)', resize: 'none',
                maxHeight: 200, overflowY: 'auto',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              style={{
                position: 'absolute', right: 12, bottom: 12,
                width: 36, height: 36, borderRadius: 10,
                border: 'none',
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #00d4ff, #7c3aed)'
                  : 'rgba(255,255,255,0.06)',
                color: input.trim() && !isTyping ? '#fff' : '#334155',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, transition: 'all 0.2s',
                fontFamily: 'var(--font-ui)',
              }}
            >↑</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, color: '#1e293b', fontSize: 12 }}>
            Dawood AI can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Home Page
// ─────────────────────────────────────────────────────────────────────────────

function HomePage({ onSignIn }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) onSignIn();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', paddingTop: 120,
    }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 760, padding: '0 24px', zIndex: 1 }}>
        {/* Badge */}
        <div className="hero-text" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 100,
          background: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.2)',
          marginBottom: 32,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 600 }}>Open-source · v1.0.0 now available</span>
        </div>

        {/* Title */}
        <h1 className="hero-text" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(48px, 7vw, 80px)',
          fontWeight: 300,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: 24,
          color: '#e2e8f0',
        }}>
          Meet{' '}
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'shimmer 4s linear infinite',
          }}>Dawood AI</span>
        </h1>

        <p className="hero-sub" style={{
          fontSize: 20, lineHeight: 1.65,
          color: '#64748b', marginBottom: 48, maxWidth: 560, margin: '0 auto 48px',
        }}>
          A powerful open-source AI agent for your terminal and browser.
          Code, automate, create — directly from the command line or web.
        </p>

        {/* Chat input */}
        <div className="hero-cta" style={{
          position: 'relative', maxWidth: 620, margin: '0 auto 24px',
        }}>
          <div style={{
            background: 'rgba(12,21,38,0.8)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 20, padding: '4px 4px 4px 24px',
            display: 'flex', alignItems: 'center', gap: 12,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.05)',
            transition: 'border-color 0.2s',
          }}>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Dawood anything..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#e2e8f0', fontSize: 16, fontFamily: 'var(--font-ui)',
                padding: '10px 0',
              }}
            />
            <button
              onClick={onSignIn}
              style={{
                padding: '12px 24px', borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
                whiteSpace: 'nowrap', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >Start chatting →</button>
          </div>
        </div>

        {/* CTA links */}
        <div className="hero-cta" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32,
          marginBottom: 80,
        }}>
          <button onClick={onSignIn} style={{
            background: 'transparent', border: 'none',
            color: '#64748b', fontSize: 14, cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
          }}
          onMouseEnter={e => e.target.style.color = '#e2e8f0'}
          onMouseLeave={e => e.target.style.color = '#64748b'}
          >Sign up free</button>
          <span style={{ color: '#1e293b' }}>·</span>
          <a href="#" style={{
            color: '#64748b', fontSize: 14, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, padding: '2px 8px',
              background: 'rgba(255,255,255,0.05)', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>npm i -g @dawood</span>
            Terminal install
          </a>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="hero-terminal" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, maxWidth: 900, width: '100%', padding: '0 24px',
        zIndex: 1, marginBottom: 80,
      }}>
        {FEATURES.map(({ icon, title, desc, color }) => (
          <div key={title} className="feature-card" style={{
            padding: '24px 20px', borderRadius: 16,
            background: 'rgba(12,21,38,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            cursor: 'default',
          }}>
            <div style={{
              fontSize: 24, marginBottom: 12, color,
              fontFamily: 'var(--font-mono)',
            }}>{icon}</div>
            <div style={{
              fontSize: 15, fontWeight: 700, color: '#e2e8f0',
              marginBottom: 8, letterSpacing: '-0.01em',
            }}>{title}</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Terminal preview */}
      <div style={{
        width: '100%', maxWidth: 680, padding: '0 24px',
        zIndex: 1, marginBottom: 100,
      }}>
        <div style={{
          background: '#0a0f1a',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Terminal header */}
          <div style={{
            padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
            <span style={{
              marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 12,
              color: '#334155',
            }}>dawood — terminal</span>
          </div>
          {/* Terminal content */}
          <div style={{ padding: '20px 24px', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2 }}>
            <div style={{ color: '#334155' }}>$ npm install -g @dawood</div>
            <div style={{ color: '#22c55e' }}>✓ Installed @dawood/cli@1.0.0 globally</div>
            <div style={{ color: '#334155', marginTop: 8 }}>$ dawood</div>
            <div style={{ color: '#00d4ff', marginTop: 4 }}>
              ██████╗  █████╗ ██╗    ██╗ ██████╗  ██████╗ ██████╗     █████╗ ██╗
            </div>
            <div style={{ color: '#64748b', fontSize: 12 }}>  Dawood AI Chatbot — Open-Source Terminal AI Agent</div>
            <div style={{ color: '#64748b', fontSize: 12 }}>  v1.0.0 · MIT License · github.com/dawood-ai/dawood</div>
            <div style={{ marginTop: 12, color: '#475569' }}>  › <span className="terminal-cursor" style={{
              display: 'inline-block', width: 8, height: 14,
              background: '#00d4ff', verticalAlign: 'middle',
              animation: 'blink 1s step-end infinite',
            }} /></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        width: '100%', padding: '24px 32px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 1,
      }}>
        <span style={{ color: '#1e293b', fontSize: 13 }}>
          © 2025 Dawood AI — Open Source (MIT)
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['GitHub', 'Docs', 'Discord', 'Twitter'].map(l => (
            <a key={l} href="#" style={{
              color: '#1e293b', fontSize: 13, textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#64748b'}
            onMouseLeave={e => e.target.style.color = '#1e293b'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'chat'
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignedIn = (userData) => {
    setUser(userData);
    setShowAuth(false);
    setView('chat');
  };

  const handleSignOut = () => {
    setUser(null);
    setView('home');
  };

  if (view === 'chat' && user) {
    return <ChatPage user={user} onSignOut={handleSignOut} />;
  }

  return (
    <>
      <AuroraBackground />
      <Navbar onSignIn={() => setShowAuth(true)} />
      <HomePage onSignIn={() => setShowAuth(true)} />
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSignedIn={handleSignedIn}
        />
      )}
    </>
  );
}