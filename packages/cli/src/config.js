import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export const CONFIG_DIR  = join(homedir(), '.dawood');
export const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

export const PROVIDER_DEFAULTS = {
  anthropic: {
    model: 'claude-sonnet-4-20250514',
    apiUrl: 'https://api.anthropic.com/v1/messages',
  },
  openai: {
    model: 'gpt-4o',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
  },
};

export const DEFAULT_CONFIG = {
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
  apiKey: '',
  systemPrompt:
    'You are Dawood AI, a brilliant and helpful AI assistant running in a terminal. ' +
    'Be concise but thorough. When writing code, always use proper markdown code blocks ' +
    'with the language identifier. Format responses for terminal readability.',
  streaming: true,
  maxTokens: 4096,
  theme: 'dark',
};

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig() {
  ensureConfigDir();
  if (!existsSync(CONFIG_FILE)) {
    const cfg = { ...DEFAULT_CONFIG };
    saveConfig(cfg);
    return cfg;
  }
  try {
    const raw = readFileSync(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config) {
  ensureConfigDir();
  const toSave = { ...config, updatedAt: new Date().toISOString() };
  writeFileSync(CONFIG_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
}

export function getConfigPath() {
  return CONFIG_FILE;
}
