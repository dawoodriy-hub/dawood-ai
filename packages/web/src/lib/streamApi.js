const API_BASE = import.meta.env.DEV ? 'http://localhost:8787' : (import.meta.env.VITE_API_URL || '');

/**
 * Stream chat replies from the local Dawood AI server (OpenRouter).
 * Yields { type: 'text' | 'tool' | 'reset' | 'error', ... }
 */

export async function* streamChat({ messages, model, systemPrompt, signal }) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model, systemPrompt }),
    signal,
  });

  if (!res.ok) {
    let msg = `Server error ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data) continue;
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          continue;
        }
        if (parsed.type === 'done') return;
        if (parsed.type === 'error') throw new Error(parsed.error || 'Chat failed');
        yield parsed;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function fetchModels() {
  try {
    const res = await fetch(`${API_BASE}/api/models`);
    if (!res.ok) return [];
    const body = await res.json();
    return body.models || [];
  } catch {
    return [];
  }
}
