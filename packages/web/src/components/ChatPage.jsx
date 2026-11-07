import { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat, fetchModels } from '../lib/streamApi.js';
import { SAMPLE_PROMPTS, DEFAULT_SYSTEM_PROMPT } from '../lib/constants.jsx';
import {
  loadChats,
  saveChats,
  createConversation,
} from '../lib/storage.js';
import MarkdownMessage from './MarkdownMessage.jsx';

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;
const speechSupported = Boolean(SpeechRecognition);

function DAvatar({ size = 32 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        flexShrink: 0,
        background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 700,
        color: '#fff',
        fontFamily: 'var(--font-mono)',
      }}
    >
      D
    </div>
  );
}

function readClipboardMedia(event) {
  return Array.from(event.clipboardData?.files || [])
    .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
    .slice(0, 4)
    .map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name || (file.type.startsWith('image/') ? 'pasted image' : 'pasted video'),
      type: file.type,
      src: URL.createObjectURL(file),
      file,
    }));
}

function TypingDots() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        animation: 'message-in 0.3s ease-out',
      }}
    >
      <DAvatar />
      <div
        style={{
          display: 'flex',
          gap: 5,
          padding: '14px 18px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#00d4ff',
              animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function titleFromText(text) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return 'New chat';
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}

const PROMPT_STORAGE_KEY = 'dawood-ai-system-prompt';

function loadSystemPrompt() {
  try {
    return localStorage.getItem(PROMPT_STORAGE_KEY) || DEFAULT_SYSTEM_PROMPT;
  } catch {
    return DEFAULT_SYSTEM_PROMPT;
  }
}

export default function ChatPage({ session, onSignOut }) {
  const { email, displayName } = session;

  const [conversations, setConversations] = useState(() => {
    const saved = loadChats(email);
    return saved.length ? saved : [createConversation(displayName)];
  });
  const [activeId, setActiveId] = useState(() => conversations[0]?.id);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [models, setModels] = useState([{ value: 'openai-fast', label: 'Dawood AI' }]);
  const [model, setModel] = useState('openai-fast');
  const [systemPrompt, setSystemPrompt] = useState(loadSystemPrompt);
  const [promptDraft, setPromptDraft] = useState(systemPrompt);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [error, setError] = useState('');
  const [toolHint, setToolHint] = useState('');
  const [listening, setListening] = useState(false);
  const [menuChatId, setMenuChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [titleDraft, setTitleDraft] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);
  const recognitionRef = useRef(null);

  const active = conversations.find((c) => c.id === activeId) || conversations[0];
  const messages = active?.messages || [];

  useEffect(() => {
    saveChats(email, conversations);
  }, [conversations, email]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming, toolHint]);

  useEffect(() => {
    fetchModels().then((list) => {
      if (list.length) {
        setModels(list);
        setModel((prev) => (list.some((m) => m.value === prev) ? prev : list[0].value));
      }
    });
  }, []);

  const updateActive = useCallback((updater) => {
    setConversations((prev) =>
      prev.map((chat) => (chat.id === activeId ? updater(chat) : chat))
    );
  }, [activeId]);

  const sendMessage = useCallback(async () => {
    if ((!input.trim() && !attachments.length) || isStreaming || !active) return;

    const userText = input.trim();
    const media = attachments;
    setInput('');
    setAttachments([]);
    setError('');
    setToolHint('');

    const history = [...messages, { role: 'user', content: userText || 'Please inspect the attached media.', attachments: media }];
    updateActive((chat) => ({
      ...chat,
      title: chat.title === 'New chat' ? titleFromText(userText) : chat.title,
      messages: [...history, { role: 'assistant', content: '' }],
    }));
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let response = '';
      const apiMessages = history.filter(
        (m) => m.role === 'user' || (m.role === 'assistant' && m.content)
      ).map(({ role, content, attachments: attached }) => ({
        role,
        content,
        attachments: attached?.map(({ name, type }) => ({ name, type })) || [],
      }));

      for await (const event of streamChat({
        messages: apiMessages,
        model,
        systemPrompt,
        signal: controller.signal,
      })) {
        if (controller.signal.aborted) break;
        if (event.type === 'reset') {
          response = '';
          updateActive((chat) => {
            const next = [...chat.messages];
            next[next.length - 1] = { role: 'assistant', content: '' };
            return { ...chat, messages: next };
          });
        } else if (event.type === 'text' && event.text) {
          response += event.text;
          const snapshot = response;
          updateActive((chat) => {
            const next = [...chat.messages];
            next[next.length - 1] = { role: 'assistant', content: snapshot };
            return { ...chat, messages: next };
          });
        } else if (event.type === 'tool') {
          setToolHint(
            event.status === 'running' ? `Using ${event.name}…` : `Used ${event.name}`
          );
        }
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err.message);
        updateActive((chat) => {
          const last = chat.messages[chat.messages.length - 1];
          if (last?.role === 'assistant' && !last.content) {
            return { ...chat, messages: chat.messages.slice(0, -1) };
          }
          return chat;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, attachments, isStreaming, active, messages, model, systemPrompt, updateActive]);

  function handlePaste(e) {
    const media = readClipboardMedia(e);
    if (!media.length) return;
    e.preventDefault();
    setAttachments((current) => [...current, ...media].slice(0, 4));
  }

  function removeAttachment(id) {
    setAttachments((current) => {
      const item = current.find((attachment) => attachment.id === id);
      if (item?.src) URL.revokeObjectURL(item.src);
      return current.filter((attachment) => attachment.id !== id);
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function openPromptEditor() {
    setPromptDraft(systemPrompt);
    setShowPromptEditor(true);
  }

  function savePrompt() {
    const nextPrompt = promptDraft.trim() || DEFAULT_SYSTEM_PROMPT;
    setSystemPrompt(nextPrompt);
    setPromptDraft(nextPrompt);
    try {
      localStorage.setItem(PROMPT_STORAGE_KEY, nextPrompt);
    } catch {
      // Keep the prompt active for this session if storage is unavailable.
    }
    setShowPromptEditor(false);
  }

  function resetPrompt() {
    setPromptDraft(DEFAULT_SYSTEM_PROMPT);
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    try {
      localStorage.removeItem(PROMPT_STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
    setShowPromptEditor(false);
  }

  function handleNewChat() {
    const chat = createConversation(displayName);
    setConversations((prev) => [chat, ...prev]);
    setActiveId(chat.id);
    setError('');
    setToolHint('');
  }

  function beginRename(chat) {
    if (isStreaming) return;
    setMenuChatId(null);
    setEditingChatId(chat.id);
    setTitleDraft(chat.title);
  }

  function saveRename() {
    const title = titleDraft.trim() || 'New chat';
    setConversations((prev) => prev.map((chat) => (
      chat.id === editingChatId ? { ...chat, title } : chat
    )));
    setEditingChatId(null);
    setTitleDraft('');
  }

  function cancelRename() {
    setEditingChatId(null);
    setTitleDraft('');
  }

  function deleteChat(chat) {
    if (isStreaming || !window.confirm(`Delete "${chat.title}"? This cannot be undone.`)) return;

    const remaining = conversations.filter((item) => item.id !== chat.id);
    if (!remaining.length) {
      const freshChat = createConversation(displayName);
      setConversations([freshChat]);
      setActiveId(freshChat.id);
    } else {
      setConversations(remaining);
      if (activeId === chat.id) setActiveId(remaining[0].id);
    }
    setMenuChatId(null);
    setError('');
    setToolHint('');
  }

  function handleExport() {
    const md = [
      '# Dawood AI Conversation',
      `> Exported: ${new Date().toLocaleString()}`,
      `> Model: ${model}`,
      '',
      ...messages.map(
        ({ role, content }) => `## ${role === 'user' ? 'You' : 'Dawood'}\n\n${content}`
      ),
    ].join('\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dawood-chat-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleMic() {
    if (!speechSupported) return;
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = navigator.language || 'en-GB';
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  const iconBtn = {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
  };

  return (
    <div
      style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'var(--font-ui)' }}
    >
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: 'rgba(5,10,20,0.98)',
          borderRight: '1px solid rgba(0,212,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'var(--font-mono)',
            }}
          >
            D
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dawood AI
          </span>
        </div>

        <button
          onClick={handleNewChat}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid rgba(0,212,255,0.2)',
            background: 'rgba(0,212,255,0.06)',
            color: '#00d4ff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            marginBottom: 16,
            width: '100%',
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> New chat
        </button>

        <div
          style={{
            color: '#334155',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            padding: '0 8px',
            marginBottom: 8,
          }}
        >
          RECENT
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((chat) => (
            <div key={chat.id} style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 2 }}>
              {editingChatId === chat.id ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(event) => setTitleDraft(event.target.value)}
                  onBlur={saveRename}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') saveRename();
                    if (event.key === 'Escape') cancelRename();
                  }}
                  aria-label="Conversation title"
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8,
                    border: '1px solid rgba(0,212,255,0.45)', background: 'rgba(12,21,38,0.95)',
                    color: '#e2e8f0', fontSize: 13, fontFamily: 'var(--font-ui)', outline: 'none',
                  }}
                />
              ) : (
                <button
                  onClick={() => {
                    if (!isStreaming) setActiveId(chat.id);
                  }}
                  title={chat.title}
                  style={{
                    flex: 1, minWidth: 0, padding: '9px 34px 9px 12px', borderRadius: 8, border: 'none',
                    background: chat.id === activeId ? 'rgba(0,212,255,0.08)' : 'transparent',
                    color: chat.id === activeId ? '#e2e8f0' : '#64748b', fontSize: 13, cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'var(--font-ui)', overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chat.title}
                </button>
              )}
              {editingChatId !== chat.id && (
                <button
                  type="button"
                  aria-label={`Manage ${chat.title}`}
                  title="Rename or delete"
                  disabled={isStreaming}
                  onClick={() => setMenuChatId((current) => current === chat.id ? null : chat.id)}
                  style={{
                    position: 'absolute', right: 5, width: 26, height: 26, border: 'none', borderRadius: 6,
                    background: menuChatId === chat.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: '#94a3b8', cursor: isStreaming ? 'not-allowed' : 'pointer', fontSize: 18, lineHeight: 1,
                  }}
                >
                  ⋯
                </button>
              )}
              {menuChatId === chat.id && (
                <div
                  style={{
                    position: 'absolute', zIndex: 10, right: 6, top: 34, minWidth: 118, padding: 4,
                    borderRadius: 8, background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
                  }}
                >
                  <button type="button" onClick={() => beginRename(chat)} style={{ width: '100%', padding: '7px 9px', border: 'none', background: 'transparent', color: '#cbd5e1', cursor: 'pointer', textAlign: 'left', fontSize: 12 }}>
                    Rename
                  </button>
                  <button type="button" onClick={() => deleteChat(chat)} style={{ width: '100%', padding: '7px 9px', border: 'none', background: 'transparent', color: '#ff6b6b', cursor: 'pointer', textAlign: 'left', fontSize: 12 }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 'auto',
            padding: '12px 8px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {(displayName || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: '#e2e8f0',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {displayName || 'You'}
              </div>
              <div
                style={{
                  color: '#334155',
                  fontSize: 11,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={handleExport}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'transparent',
                color: '#475569',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Export
            </button>
            <button
              onClick={onSignOut}
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'transparent',
                color: '#475569',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#050a14',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            position: 'relative',
          }}
        >
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isStreaming}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              outline: 'none',
            }}
          >
            {models.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openPromptEditor}
            title="Edit system prompt"
            style={{
              padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
              background: showPromptEditor ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
              color: showPromptEditor ? '#00d4ff' : '#94a3b8', cursor: 'pointer', fontSize: 12,
              fontFamily: 'var(--font-ui)',
            }}
          >
            Prompt
          </button>
          {toolHint && (
            <span style={{ color: '#00d4ff', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              {toolHint}
            </span>
          )}
          {showPromptEditor && (
            <div
              style={{
                position: 'absolute', zIndex: 20, top: 'calc(100% + 8px)', left: 24, width: 420,
                padding: 16, borderRadius: 12, background: '#111827',
                border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 18px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                System prompt
              </div>
              <textarea
                value={promptDraft}
                onChange={(event) => setPromptDraft(event.target.value)}
                rows={5}
                aria-label="System prompt"
                style={{
                  width: '100%', resize: 'vertical', padding: 10, borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)',
                  color: '#cbd5e1', fontSize: 12, lineHeight: 1.5, fontFamily: 'var(--font-ui)', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button type="button" onClick={resetPrompt} style={{ padding: '6px 10px', borderRadius: 7, border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 12 }}>
                  Reset
                </button>
                <button type="button" onClick={savePrompt} style={{ padding: '6px 12px', borderRadius: 7, border: 'none', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                  Save prompt
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={`${activeId}-${i}`}
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'message-in 0.3s ease-out',
              }}
            >
              {msg.role === 'assistant' && <DAvatar />}
              <div
                style={{
                  maxWidth: '72%',
                  padding: '14px 18px',
                  borderRadius: 16,
                  background:
                    msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12))'
                      : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  color: '#e2e8f0',
                  fontSize: 15,
                  lineHeight: 1.7,
                  wordBreak: 'break-word',
                  whiteSpace: msg.role === 'user' ? 'pre-wrap' : 'normal',
                }}
              >
                {msg.role === 'assistant' ? (
                  <MarkdownMessage content={msg.content} />
                ) : (
                  <>
                    {msg.attachments?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: msg.content ? 10 : 0 }}>
                        {msg.attachments.map((attachment) => (
                          attachment.type?.startsWith('video/') ? (
                            <video key={attachment.id || attachment.name} src={attachment.src} controls style={{ maxWidth: 260, maxHeight: 180, borderRadius: 10 }} />
                          ) : (
                            <img key={attachment.id || attachment.name} src={attachment.src} alt={attachment.name} style={{ maxWidth: 260, maxHeight: 180, borderRadius: 10, objectFit: 'cover' }} />
                          )
                        ))}
                      </div>
                    )}
                    {msg.content}
                  </>
                )}
                {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                  <span
                    className="terminal-cursor"
                    style={{
                      display: 'inline-block',
                      width: 2,
                      height: '1em',
                      background: '#00d4ff',
                      verticalAlign: 'middle',
                      marginLeft: 2,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1]?.content === '' && <TypingDots />}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid rgba(255,107,107,0.25)',
                background: 'rgba(255,107,107,0.06)',
                color: '#ff6b6b',
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && !isStreaming && (
          <div style={{ padding: '0 48px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setInput(p)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#64748b',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: '0 48px 28px' }}>
          <div
            style={{
              position: 'relative',
              background: 'rgba(12,21,38,0.8)',
              border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 16,
              boxShadow: '0 0 40px rgba(0,212,255,0.05)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {attachments.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '10px 12px 0' }}>
                {attachments.map((attachment) => (
                  <div key={attachment.id} style={{ position: 'relative' }}>
                    {attachment.type.startsWith('video/') ? (
                      <video src={attachment.src} muted style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8 }} />
                    ) : (
                      <img src={attachment.src} alt={attachment.name} style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 8 }} />
                    )}
                    <button type="button" onClick={() => removeAttachment(attachment.id)} title="Remove attachment" style={{ position: 'absolute', top: -7, right: -7, width: 20, height: 20, border: 0, borderRadius: '50%', background: '#ef4444', color: '#fff', cursor: 'pointer', lineHeight: 1 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Message Dawood AI..."
              rows={1}
              style={{
                width: '100%',
                padding: '16px 120px 16px 20px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#e2e8f0',
                fontSize: 15,
                lineHeight: 1.6,
                fontFamily: 'var(--font-ui)',
                resize: 'none',
                maxHeight: 200,
                overflowY: 'auto',
              }}
            />
            {speechSupported && !isStreaming && (
              <button
                type="button"
                onClick={toggleMic}
                title={listening ? 'Stop listening' : 'Speak'}
                style={{
                  ...iconBtn,
                  position: 'absolute',
                  right: 56,
                  bottom: 12,
                  background: listening ? 'rgba(255,107,107,0.18)' : iconBtn.background,
                  color: listening ? '#ff6b6b' : iconBtn.color,
                }}
              >
                mic
              </button>
            )}
            {isStreaming ? (
              <button
                onClick={handleStop}
                style={{
                  position: 'absolute',
                  right: 12,
                  bottom: 12,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: 'rgba(255,107,107,0.15)',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}
                title="Pause generation"
              >
                ‖
              </button>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!input.trim() && !attachments.length}
                style={{
                  position: 'absolute',
                  right: 12,
                  bottom: 12,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: 'none',
                  background: input.trim() || attachments.length
                    ? 'linear-gradient(135deg, #00d4ff, #7c3aed)'
                    : 'rgba(255,255,255,0.06)',
                  color: input.trim() || attachments.length ? '#fff' : '#334155',
                  cursor: input.trim() || attachments.length ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
                title="Send (Enter)"
              >
                ↑
              </button>
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
