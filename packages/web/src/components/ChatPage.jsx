import { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat } from '../lib/streamApi.js';
import { PROVIDER_DEFAULTS, SAMPLE_PROMPTS, DEFAULT_SYSTEM_PROMPT } from '../lib/constants.js';

function DAvatar({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3, flexShrink: 0,
      background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)',
    }}>D</div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'message-in 0.3s ease-out' }}>
      <DAvatar />
      <div style={{ display: 'flex', gap: 5, padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%', background: '#00d4ff',
            animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatPage({ session, onSignOut }) {
  const { provider, model: initialModel, apiKey } = session;

  const [messages, setMessages]     = useState([{
    role: 'assistant',
    content: 'Hello! I\'m Dawood AI. I can help you write code, debug issues, explain concepts, automate workflows, and more. What would you like to explore today?',
  }]);
  const [conversations, setConversations] = useState(['Current chat']);
  const [input, setInput]           = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [model, setModel]           = useState(initialModel);
  const [error, setError]           = useState('');
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const abortRef    = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput('');
    setError('');

    const history = [...messages, { role: 'user', content: userText }];
    setMessages(history);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      let response = '';
      for await (const chunk of streamChat({
        messages: history,
        provider,
        model,
        apiKey,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
      })) {
        if (controller.signal.aborted) break;
        response += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: response };
          return updated;
        });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err.message);
        setMessages(prev => prev.slice(0, -1));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, isStreaming, messages, provider, model, apiKey]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleNewChat() {
    setMessages([{ role: 'assistant', content: 'New conversation started! How can I help you?' }]);
    setConversations(prev => [`Chat ${prev.length + 1}`, ...prev]);
    setError('');
  }

  function handleExport() {
    const md = [
      '# Dawood AI Conversation',
      `> Exported: ${new Date().toLocaleString()}`,
      `> Provider: ${provider} / Model: ${model}`,
      '',
      ...messages.map(({ role, content }) =>
        `## ${role === 'user' ? '👤 You' : '🤖 Dawood'}\n\n${content}`
      ),
    ].join('\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `dawood-chat-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const models = PROVIDER_DEFAULTS[provider]?.models ?? [];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'var(--font-ui)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, flexShrink: 0,
        background: 'rgba(5,10,20,0.98)',
        borderRight: '1px solid rgba(0,212,255,0.08)',
        display: 'flex', flexDirection: 'column',
        padding: '16px 12px',
      }}>
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

        <button
          onClick={handleNewChat}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10,
            border: '1px solid rgba(0,212,255,0.2)',
            background: 'rgba(0,212,255,0.06)',
            color: '#00d4ff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-ui)',
            marginBottom: 16, transition: 'all 0.2s', width: '100%',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
        >
          <span style={{ fontSize: 16 }}>+</span> New chat
        </button>

        <div style={{ color: '#334155', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', padding: '0 8px', marginBottom: 8 }}>RECENT</div>
        {conversations.map((title, i) => (
          <button key={i} style={{
            display: 'block', padding: '9px 12px', borderRadius: 8,
            border: 'none', background: i === 0 ? 'rgba(0,212,255,0.08)' : 'transparent',
            color: i === 0 ? '#e2e8f0' : '#64748b',
            fontSize: 13, cursor: 'pointer', textAlign: 'left',
            fontFamily: 'var(--font-ui)', width: '100%',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; } }}
          onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
          >{title}</button>
        ))}

        {/* User footer */}
        <div style={{ marginTop: 'auto', padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>U</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{provider}</div>
              <div style={{ color: '#334155', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{model}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleExport} style={{
              flex: 1, padding: '6px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
              color: '#475569', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
            >Export</button>
            <button onClick={onSignOut} style={{
              flex: 1, padding: '6px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.06)', background: 'transparent',
              color: '#475569', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-ui)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
            >Sign out</button>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#050a14', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            style={{
              padding: '6px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8', fontSize: 13,
              cursor: 'pointer', fontFamily: 'var(--font-ui)', outline: 'none',
            }}
          >
            {models.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <span style={{ color: '#1e293b', fontSize: 12 }}>·</span>
          <span style={{ color: '#334155', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            {PROVIDER_DEFAULTS[provider]?.label}
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'message-in 0.3s ease-out',
            }}>
              {msg.role === 'assistant' && <DAvatar />}
              <div style={{
                maxWidth: '72%', padding: '14px 18px', borderRadius: 16,
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                color: '#e2e8f0', fontSize: 15, lineHeight: 1.7,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {msg.content}
                {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span className="terminal-cursor" style={{
                    display: 'inline-block', width: 2, height: '1em',
                    background: '#00d4ff', verticalAlign: 'middle', marginLeft: 2,
                  }} />
                )}
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1]?.content === '' && <TypingDots />}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,107,107,0.25)',
              background: 'rgba(255,107,107,0.06)', color: '#ff6b6b', fontSize: 14,
            }}>
              ⚠ {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts — shown when only 1 message */}
        {messages.length === 1 && !isStreaming && (
          <div style={{ padding: '0 48px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SAMPLE_PROMPTS.map(p => (
              <button key={p} onClick={() => setInput(p)} style={{
                padding: '7px 14px', borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#64748b', fontSize: 12, cursor: 'pointer',
                fontFamily: 'var(--font-ui)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >{p}</button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{ padding: '0 48px 28px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(12,21,38,0.8)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 16,
            boxShadow: '0 0 40px rgba(0,212,255,0.05)',
            backdropFilter: 'blur(20px)',
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message Dawood AI..."
              rows={1}
              style={{
                width: '100%', padding: '16px 56px 16px 20px',
                background: 'transparent', border: 'none', outline: 'none',
                color: '#e2e8f0', fontSize: 15, lineHeight: 1.6,
                fontFamily: 'var(--font-ui)', resize: 'none',
                maxHeight: 200, overflowY: 'auto',
              }}
            />
            {isStreaming ? (
              <button
                onClick={handleStop}
                style={{
                  position: 'absolute', right: 12, bottom: 12,
                  width: 36, height: 36, borderRadius: 10, border: 'none',
                  background: 'rgba(255,107,107,0.15)',
                  color: '#ff6b6b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, transition: 'all 0.15s',
                }}
                title="Stop generating"
              >■</button>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                style={{
                  position: 'absolute', right: 12, bottom: 12,
                  width: 36, height: 36, borderRadius: 10, border: 'none',
                  background: input.trim()
                    ? 'linear-gradient(135deg, #00d4ff, #7c3aed)'
                    : 'rgba(255,255,255,0.06)',
                  color: input.trim() ? '#fff' : '#334155',
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, transition: 'all 0.2s',
                }}
                title="Send (Enter)"
              >↑</button>
            )}
          </div>
          <p style={{ textAlign: 'center', marginTop: 10, color: '#1e293b', fontSize: 12 }}>
            Dawood AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
