export const OPENROUTER_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Get the current date and time. Pass an IANA timezone when the user names a place.',
      parameters: {
        type: 'object',
        properties: {
          timeZone: {
            type: 'string',
            description: 'IANA timezone such as Europe/London or America/New_York',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a basic arithmetic expression. Use for math the user asks you to compute.',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Expression using numbers and + - * / % ^ ( )',
          },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the public web for recent facts, definitions, or short snippets.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
    },
  },
];

function parseArgs(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getCurrentTime(args) {
  const timeZone = args.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone,
    }).format(now);
    return JSON.stringify({ timeZone, iso: now.toISOString(), formatted });
  } catch {
    return JSON.stringify({ error: `Unknown timezone: ${timeZone}` });
  }
}

function calculator(args) {
  const expression = String(args.expression || '').trim();
  if (!expression) return JSON.stringify({ error: 'Missing expression' });
  if (!/^[0-9+\-*/().%\s^]+$/.test(expression)) {
    return JSON.stringify({ error: 'Only numbers and + - * / % ^ ( ) are allowed' });
  }
  try {
    const sanitized = expression.replace(/\^/g, '**');
    const value = Function(`"use strict"; return (${sanitized})`)();
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return JSON.stringify({ error: 'Result was not a finite number' });
    }
    return JSON.stringify({ expression, value });
  } catch (err) {
    return JSON.stringify({ error: err.message || 'Could not evaluate expression' });
  }
}

async function webSearch(args) {
  const query = String(args.query || '').trim();
  if (!query) return JSON.stringify({ error: 'Missing query' });

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DawoodAI/1.0' },
  });
  if (!res.ok) return JSON.stringify({ error: `Search failed (${res.status})` });

  const data = await res.json();
  const snippets = [];
  if (data.AbstractText) snippets.push(data.AbstractText);
  if (data.Answer) snippets.push(String(data.Answer));
  if (data.Definition) snippets.push(data.Definition);
  for (const topic of data.RelatedTopics || []) {
    if (topic.Text) snippets.push(topic.Text);
    for (const nested of topic.Topics || []) {
      if (nested.Text) snippets.push(nested.Text);
    }
  }

  const unique = [...new Set(snippets.map((s) => s.trim()).filter(Boolean))].slice(0, 8);
  return JSON.stringify({
    query,
    source: data.AbstractURL || data.AbstractSource || 'DuckDuckGo',
    results: unique.length ? unique : ['No snippets found. Try a more specific query.'],
  });
}

export async function runTool(name, rawArgs) {
  const args = parseArgs(rawArgs);
  if (name === 'get_current_time') return getCurrentTime(args);
  if (name === 'calculator') return calculator(args);
  if (name === 'web_search') return webSearch(args);
  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

const TIMEZONES = [
  ['london', 'Europe/London'],
  ['uk', 'Europe/London'],
  ['britain', 'Europe/London'],
  ['new york', 'America/New_York'],
  ['tokyo', 'Asia/Tokyo'],
  ['paris', 'Europe/Paris'],
  ['dubai', 'Asia/Dubai'],
  ['sydney', 'Australia/Sydney'],
  ['los angeles', 'America/Los_Angeles'],
];

function guessTimeZone(text) {
  const lower = text.toLowerCase();
  for (const [place, zone] of TIMEZONES) {
    if (lower.includes(place)) return zone;
  }
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function extractMath(text) {
  const pct = text.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
  if (pct) return `(${pct[1]}/100)*${pct[2]}`;
  if (!/\d/.test(text)) return null;
  if (!/\b(what is|what's|calculate|compute|plus|minus|times|divided)\b|[+\-*/^%]/i.test(text)) {
    return null;
  }
  const cleaned = text.replace(/[^0-9+\-*/().%\s^]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned || !/[+\-*/^%]/.test(cleaned)) return null;
  return cleaned;
}

export function pickLocalTools(userText) {
  const text = String(userText || '');
  const lower = text.toLowerCase();
  const picks = [];

  const math = extractMath(text);
  if (math) {
    picks.push({ name: 'calculator', args: { expression: math } });
  }

  if (/\b(time|date|timezone|clock|what day)\b/i.test(lower)) {
    picks.push({ name: 'get_current_time', args: { timeZone: guessTimeZone(text) } });
  }

  if (
    !math &&
    /\b(search|look up|look up|latest|news|who is|who was|where is|current .+ version)\b/i.test(lower)
  ) {
    picks.push({ name: 'web_search', args: { query: text } });
  }

  return picks;
}
