/**
 * Streaming API calls for Anthropic and OpenAI — runs in the browser.
 * Yields text chunks as they arrive via SSE.
 */

export async function* streamChat({ messages, provider, model, apiKey, systemPrompt, maxTokens = 4096 }) {
  if (provider === 'anthropic') {
    yield* streamAnthropic({ messages, model, apiKey, systemPrompt, maxTokens });
  } else if (provider === 'openai') {
    yield* streamOpenAI({ messages, model, apiKey, systemPrompt, maxTokens });
  } else {
    throw new Error(`Unsupported provider: "${provider}"`);
  }
}

async function* streamAnthropic({ messages, model, apiKey, systemPrompt, maxTokens }) {
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
    let msg = `Anthropic error ${res.status}`;
    try { msg = (await res.json())?.error?.message || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }

  yield* parseSse(res.body, (parsed) => {
    if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
      return parsed.delta.text;
    }
    return null;
  });
}

async function* streamOpenAI({ messages, model, apiKey, systemPrompt, maxTokens }) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(({ role, content }) => ({ role, content })),
      ],
    }),
  });

  if (!res.ok) {
    let msg = `OpenAI error ${res.status}`;
    try { msg = (await res.json())?.error?.message || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }

  yield* parseSse(res.body, (parsed) => parsed.choices?.[0]?.delta?.content ?? null);
}

async function* parseSse(body, extractor) {
  const reader  = body.getReader();
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
          const chunk = extractor(JSON.parse(data));
          if (chunk) yield chunk;
        } catch { /* skip malformed */ }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
