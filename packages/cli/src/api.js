/**
 * Streaming AI API abstraction.
 * Supports Anthropic Messages API and OpenAI Chat Completions API.
 * Uses native fetch + ReadableStream (Node 18+) for SSE streaming.
 */

/**
 * Yields text chunks from the selected provider.
 * @param {{ messages: Array, config: Object }} opts
 */
export async function* streamChat({ messages, config }) {
  const { provider } = config;
  if (provider === 'anthropic') {
    yield* streamAnthropic({ messages, config });
  } else if (provider === 'openai') {
    yield* streamOpenAI({ messages, config });
  } else {
    throw new Error(`Unsupported provider: "${provider}". Use "anthropic" or "openai".`);
  }
}

// ── Anthropic ────────────────────────────────────────────────────────────────

async function* streamAnthropic({ messages, config }) {
  const { model, apiKey, systemPrompt, maxTokens } = config;

  if (!apiKey) throw new Error('No API key set. Run: /key sk-ant-...');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      stream: true,
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  });

  if (!res.ok) {
    let msg = `Anthropic API error ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.error?.message || msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }

  yield* parseSseStream(res.body, (parsed) => {
    if (
      parsed.type === 'content_block_delta' &&
      parsed.delta?.type === 'text_delta'
    ) {
      return parsed.delta.text;
    }
    return null;
  });
}

// ── OpenAI ───────────────────────────────────────────────────────────────────

async function* streamOpenAI({ messages, config }) {
  const { model, apiKey, systemPrompt, maxTokens } = config;

  if (!apiKey) throw new Error('No API key set. Run: /key sk-...');

  const body = {
    model: model || 'gpt-4o',
    max_tokens: maxTokens,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(({ role, content }) => ({ role, content })),
    ],
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = `OpenAI API error ${res.status}`;
    try {
      const b = await res.json();
      msg = b?.error?.message || msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }

  yield* parseSseStream(res.body, (parsed) => {
    return parsed.choices?.[0]?.delta?.content ?? null;
  });
}

// ── Shared SSE Parser ─────────────────────────────────────────────────────────

async function* parseSseStream(body, extractor) {
  const reader = body.getReader();
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
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const chunk = extractor(parsed);
          if (chunk) yield chunk;
        } catch { /* skip malformed JSON */ }
      }
    }
  } finally {
    reader.releaseLock();
  }
}