import { chooseFreeModel, modelInstructions, resolveModel, usesOpenRouter } from './models.js';
import { OPENROUTER_TOOLS, pickLocalTools, runTool } from './tools.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MAX_TOOL_ROUNDS = 4;

function apiKey() {
  return process.env.OPENROUTER_API_KEY?.trim();
}

function openRouterHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey()}`,
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.OPENROUTER_APP_NAME || 'Dawood AI',
  };
}

function pollinationsHeaders() {
  return {
    'Content-Type': 'application/json',
    Referer: 'http://localhost:3000',
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Dawood AI',
  };
}

async function* parseSse(body) {
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
        if (!data || data === '[DONE]') continue;
        try {
          yield JSON.parse(data);
        } catch {
          /* skip malformed */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function mergeToolCallDelta(acc, deltas) {
  for (const delta of deltas || []) {
    const index = delta.index ?? acc.length;
    if (!acc[index]) {
      acc[index] = {
        id: delta.id || `tool_${index}`,
        type: 'function',
        function: { name: '', arguments: '' },
      };
    }
    if (delta.id) acc[index].id = delta.id;
    if (delta.function?.name) acc[index].function.name += delta.function.name;
    if (delta.function?.arguments) acc[index].function.arguments += delta.function.arguments;
  }
}

function offlineReply(messages) {
  const latest = String([...messages].reverse().find((message) => message.role === 'user')?.content || '').trim();
  const lower = latest.toLowerCase();
  if (/^(hi|hello|hey|hiya)\b/.test(lower)) {
    return "Hi! I'm Dawood AI. The free online model is temporarily unreachable, but I'm still here and local tools such as calculator and time are available.";
  }
  if (/\b(thanks|thank you)\b/.test(lower)) {
    return "You're welcome. The free online model is temporarily unavailable, but local tools are still ready.";
  }
  if (/neural network/.test(lower)) {
    return 'Neural networks learn by adjusting numeric weights. They make a prediction, compare it with the correct answer using a loss function, then use backpropagation and gradient descent to slightly improve the weights. Repeating that process over many examples lets the network learn useful patterns.';
  }
  if (/\bwhat(?:'s|s| is)\s+python\b|\bpython language\b/.test(lower)) {
    return 'Python is a high-level programming language known for readable syntax and a large ecosystem. It is commonly used for web apps, automation, data science, machine learning, and scripting.';
  }
  return "I'm in offline mode because the free online model could not be reached. I can still handle local calculations and time questions; try again shortly for a full AI response.";
}

async function* streamFree({ messages, systemPrompt }) {
  const lines = [
    `System: ${systemPrompt}`,
    ...messages.slice(-8).map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`),
    'Assistant:',
  ];
  const prompt = lines.join('\n').slice(0, 3500);
  const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-fast`;
  let text = '';
  try {
    const res = await fetch(url, {
      headers: { Accept: 'text/plain' },
    });
    text = (await res.text()).trim();
    if (!res.ok || /reached its budget/i.test(text)) {
      throw new Error(text || `Chat error ${res.status}`);
    }
  } catch {
    text = offlineReply(messages);
  }
  if (!text) {
    yield { type: 'end', text: '', finishReason: 'stop', content: '', toolCalls: [] };
    return;
  }

  let content = '';
  const size = 24;
  for (let i = 0; i < text.length; i += size) {
    const chunk = text.slice(i, i + size);
    content += chunk;
    yield { type: 'delta', text: chunk, finishReason: null, content, toolCalls: [] };
  }
  yield { type: 'end', text: '', finishReason: 'stop', content, toolCalls: [] };
}

async function* streamCompletion({ messages, model, systemPrompt, withTools }) {
  if (!usesOpenRouter(model)) {
    yield* streamFree({ messages, systemPrompt });
    return;
  }

  const payload = {
    model,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  };
  if (withTools) {
    payload.tools = OPENROUTER_TOOLS;
    payload.tool_choice = 'auto';
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: openRouterHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `Chat error ${res.status}`;
    try {
      const body = await res.json();
      msg = body?.error?.message || body?.error || msg;
    } catch {
      /* ignore */
    }
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  let content = '';
  const toolCalls = [];
  let finishReason = null;

  for await (const parsed of parseSse(res.body)) {
    const choice = parsed.choices?.[0];
    if (!choice) continue;
    const delta = choice.delta || {};
    if (delta.content) content += delta.content;
    if (delta.tool_calls) mergeToolCallDelta(toolCalls, delta.tool_calls);
    if (choice.finish_reason) finishReason = choice.finish_reason;
    if (delta.content) {
      yield { type: 'delta', text: delta.content, finishReason, content, toolCalls };
    }
  }

  yield { type: 'end', text: '', finishReason, content, toolCalls: toolCalls.filter(Boolean) };
}

async function runLocalTools(userText, onEvent) {
  const picks = pickLocalTools(userText);
  if (!picks.length) return [];
  const results = [];
  for (const pick of picks) {
    onEvent({ type: 'tool', name: pick.name, status: 'running' });
    const result = await runTool(pick.name, pick.args);
    onEvent({ type: 'tool', name: pick.name, status: 'done' });
    results.push({ name: pick.name, result });
  }
  return results;
}

function formatLocalReply(results) {
  const messages = [];
  for (const { name, result } of results) {
    let data;
    try {
      data = JSON.parse(result);
    } catch {
      data = { error: result };
    }

    if (data.error) {
      messages.push(`${name === 'web_search' ? 'Web search' : 'That request'} could not be completed: ${data.error}`);
    } else if (name === 'calculator') {
      messages.push(`The answer is **${data.value}**.`);
    } else if (name === 'get_current_time') {
      messages.push(`It is ${data.formatted}.`);
    } else if (name === 'web_search') {
      messages.push((data.results || []).join('\n\n'));
    }
  }
  return messages.join('\n\n');
}

function normalizeMessages(messages) {
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
    .map(({ role, content, attachments }) => ({
      role,
      content: `${String(content)}${attachments?.length ? `\n[Attached ${attachments.map((item) => `${item.type || 'file'}: ${item.name || 'unnamed'}`).join(', ')}]` : ''}`,
    }));
}

export async function runChat({ messages, model, systemPrompt, onEvent }) {
  const history = normalizeMessages(messages);
  if (!history.length) throw new Error('No messages to send.');

  const lastUser = [...history].reverse().find((m) => m.role === 'user')?.content || '';
  const requestedModel = resolveModel(model);
  const resolvedModel = requestedModel === 'dawood-auto' ? chooseFreeModel(lastUser) : requestedModel;
  const toolResults = await runLocalTools(lastUser, onEvent);
  const toolNote = toolResults.length
    ? `\n\nUse these tool results when they help:\n${toolResults.map(({ name, result }) => `${name}: ${result}`).join('\n')}`
    : '';
  const prompt = [
    systemPrompt || 'You are Dawood AI, a helpful assistant.',
    modelInstructions(resolvedModel),
    toolNote,
  ].filter(Boolean).join('\n\n');

  if (!usesOpenRouter(resolvedModel)) {
    const localReply = formatLocalReply(toolResults);
    if (localReply) {
      onEvent({ type: 'text', text: localReply });
      return;
    }
    let finalContent = '';
    for await (const event of streamCompletion({
      messages: history,
      model: resolvedModel,
      systemPrompt: prompt,
      withTools: false,
    })) {
      if (event.text) onEvent({ type: 'text', text: event.text });
      finalContent = event.content;
    }
    if (!finalContent) {
      onEvent({ type: 'text', text: 'I could not generate a reply. Try again.' });
    }
    return;
  }

  let round = 0;
  let working = history;

  while (round < MAX_TOOL_ROUNDS) {
    round += 1;
    let finalContent = '';
    let toolCalls = [];
    let finishReason = null;

    for await (const event of streamCompletion({
      messages: working,
      model: resolvedModel,
      systemPrompt: prompt,
      withTools: true,
    })) {
      if (event.text) onEvent({ type: 'text', text: event.text });
      finalContent = event.content;
      toolCalls = event.toolCalls;
      finishReason = event.finishReason;
    }

    const usableTools = (toolCalls || []).filter((c) => c?.function?.name);
    if (!usableTools.length || finishReason === 'stop') {
      if (!finalContent && !usableTools.length) {
        onEvent({ type: 'text', text: 'I could not generate a reply. Try again.' });
      }
      return;
    }

    onEvent({ type: 'reset' });
    working = [
      ...working,
      {
        role: 'assistant',
        content: finalContent || null,
        tool_calls: usableTools,
      },
    ];

    for (const call of usableTools) {
      const name = call.function.name;
      onEvent({ type: 'tool', name, status: 'running' });
      const result = await runTool(name, call.function.arguments);
      onEvent({ type: 'tool', name, status: 'done' });
      working.push({
        role: 'tool',
        name,
        tool_call_id: call.id,
        content: result,
      });
    }
  }
}
