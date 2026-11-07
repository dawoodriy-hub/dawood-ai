const SESSION_KEY = 'dawood-ai-session';

function chatsKey(email) {
  return `dawood-ai-chats:${(email || 'local').toLowerCase()}`;
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function loadChats(email) {
  try {
    const raw = localStorage.getItem(chatsKey(email));
    const chats = raw ? JSON.parse(raw) : [];
    return Array.isArray(chats) ? chats : [];
  } catch {
    return [];
  }
}

export function saveChats(email, chats) {
  localStorage.setItem(chatsKey(email), JSON.stringify(chats));
}

export function welcomeMessage(displayName) {
  return {
    role: 'assistant',
    content: `Hello ${displayName || 'there'}! I'm Dawood AI. I can help you write code, look things up, do math, and more. What would you like to explore today?`,
  };
}

export function createConversation(displayName) {
  return {
    id: crypto.randomUUID(),
    title: 'New chat',
    messages: [welcomeMessage(displayName)],
    createdAt: Date.now(),
  };
}
