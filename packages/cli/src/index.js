/**
 * Dawood AI — Main CLI entry point
 * Handles startup, readline REPL, commands, and chat sessions.
 */

import readline from 'readline';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { loadConfig, saveConfig, getConfigPath, PROVIDER_DEFAULTS } from './config.js';
import { streamChat } from './api.js';
import {
  showBanner,
  showHelp,
  showConfig,
  showApiKeyWarning,
  printUserMessage,
  printAssistantLabel,
  printChunk,
  endAssistantMessage,
  showError,
  showSuccess,
  showInfo,
  showDivider,
  prompt,
} from './ui.js';

// ── State ─────────────────────────────────────────────────────────────────────

let config   = loadConfig();
let messages = [];  // conversation history
let busy     = false;

// ── Command Handler ───────────────────────────────────────────────────────────

async function handleCommand(input, rl) {
  const trimmed = input.trim();
  const spaceIdx = trimmed.indexOf(' ');
  const cmd  = (spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx)).toLowerCase();
  const args = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx + 1).trim();

  switch (cmd) {

    case '/help':
      showHelp();
      return true;

    case '/config':
      showConfig(config, getConfigPath());
      return true;

    case '/clear':
      messages = [];
      console.clear();
      showBanner();
      showSuccess('Conversation cleared.');
      return true;

    case '/exit':
    case '/quit':
    case '/q':
      farewell(rl);
      return true;

    case '/key':
      if (!args) { showError('Usage: /key YOUR_API_KEY'); return true; }
      config.apiKey = args;
      saveConfig(config);
      showSuccess('API key saved to ~/.dawood/config.json');
      return true;

    case '/model':
      if (!args) {
        showInfo('Current model: ' + config.model);
        showInfo('Usage: /model <name>  (e.g. /model gpt-4o)');
        return true;
      }
      config.model = args;
      saveConfig(config);
      showSuccess(`Model set to: ${config.model}`);
      return true;

    case '/provider': {
      const p = args.toLowerCase();
      if (!['anthropic', 'openai'].includes(p)) {
        showError('Usage: /provider anthropic|openai');
        return true;
      }
      config.provider = p;
      config.model    = PROVIDER_DEFAULTS[p].model;
      saveConfig(config);
      showSuccess(`Provider: ${config.provider} · Model: ${config.model}`);
      return true;
    }

    case '/system':
      if (!args) { showInfo('Current system prompt:\n  ' + config.systemPrompt); return true; }
      config.systemPrompt = args;
      saveConfig(config);
      showSuccess('System prompt updated.');
      return true;

    case '/export': {
      const ts       = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `dawood-chat-${ts}.md`;
      const dest     = join(process.cwd(), filename);
      const md = [
        '# Dawood AI Conversation',
        `> Exported: ${new Date().toLocaleString()}  `,
        `> Model: ${config.provider}/${config.model}`,
        '',
        ...messages.map(({ role, content }) =>
          `## ${role === 'user' ? '👤 You' : '🤖 Dawood'}\n\n${content}`
        ),
      ].join('\n\n');
      writeFileSync(dest, md, 'utf-8');
      showSuccess(`Exported to: ${filename}`);
      return true;
    }

    default:
      return false;
  }
}

// ── Chat ──────────────────────────────────────────────────────────────────────

async function chat(userInput) {
  if (!config.apiKey) {
    showApiKeyWarning();
    return;
  }

  messages.push({ role: 'user', content: userInput });
  printUserMessage(userInput);
  printAssistantLabel();

  let response = '';

  try {
    for await (const chunk of streamChat({ messages, config })) {
      printChunk(chunk);
      response += chunk;
    }
    endAssistantMessage();
    messages.push({ role: 'assistant', content: response });

  } catch (err) {
    endAssistantMessage();
    showError(err.message);
    // Remove the failed user message so history stays consistent
    messages.pop();
  }
}

// ── REPL ──────────────────────────────────────────────────────────────────────

function farewell(rl) {
  console.log('\n\x1b[36m  Goodbye! Thanks for using Dawood AI ✨\x1b[0m\n');
  rl?.close();
  process.exit(0);
}

async function main() {
  console.clear();
  showBanner();

  if (!config.apiKey) {
    showApiKeyWarning();
  }

  const rl = readline.createInterface({
    input:    process.stdin,
    output:   process.stdout,
    terminal: true,
    prompt:   '',
  });

  // Initial prompt
  prompt();

  rl.on('line', async (line) => {
    if (busy) return;

    const input = line.trim();

    if (!input) {
      prompt();
      return;
    }

    busy = true;

    try {
      if (input.startsWith('/')) {
        const handled = await handleCommand(input, rl);
        if (!handled) {
          showError(`Unknown command: ${input} — type /help for a list.`);
        }
      } else {
        await chat(input);
      }
    } finally {
      busy = false;
      prompt();
    }
  });

  rl.on('close', () => farewell(null));

  // Graceful Ctrl+C
  process.on('SIGINT', () => farewell(rl));
  // Unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    showError('Unexpected error: ' + (err?.message || String(err)));
    busy = false;
    prompt();
  });
}

main();