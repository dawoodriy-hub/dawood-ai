export const DEFAULT_SYSTEM_PROMPT =
  'You are Dawood AI, a brilliant and helpful assistant. ' +
  'Be concise but thorough. When writing code, always use markdown fenced code blocks with a language tag. ' +
  'If you are unsure, say so. Use tools when they help: the clock for the current time, the calculator for arithmetic, and web search for facts you may not know.';

export const FEATURES = [
  {
    icon: '⬡',
    title: 'Code & Debug',
    desc: 'Write, review, and fix code across every language and framework.',
    color: '#00d4ff',
  },
  {
    icon: '⚡',
    title: 'Automate',
    desc: 'Build workflows, scripts, and agents that handle repetitive tasks.',
    color: '#7c3aed',
  },
  {
    icon: '✦',
    title: 'Create',
    desc: 'Draft documents, emails, strategies, and creative content instantly.',
    color: '#ff6b6b',
  },
  {
    icon: '◎',
    title: 'Analyse',
    desc: 'Process data, extract insights, and reason through complex problems.',
    color: '#f59e0b',
  },
];

export const MODEL_PROFILES = [
  {
    name: 'Dawood Fast',
    value: 'openai-fast',
    summary: 'Quick, direct answers for everyday questions and simple tasks.',
    color: '#00d4ff',
  },
  {
    name: 'Dawood Code',
    value: 'dawood-code',
    summary: 'A senior engineering partner for code, debugging, and edge cases.',
    color: '#7c3aed',
  },
  {
    name: 'Dawood Creative',
    value: 'dawood-creative',
    summary: 'Brainstorm ideas, improve writing, and shape strong original content.',
    color: '#ff6b6b',
  },
  {
    name: 'Dawood Analyst',
    value: 'dawood-analyst',
    summary: 'Break down complex topics, compare options, and surface assumptions.',
    color: '#f59e0b',
  },
  {
    name: 'Dawood Tutor',
    value: 'dawood-tutor',
    summary: 'Learn step by step with plain-language explanations and examples.',
    color: '#22c55e',
  },
];

export const SAMPLE_PROMPTS = [
  'Explain how neural networks learn',
  'What time is it in London?',
  'What is 17.5% of 240?',
  'Search for the latest Node.js LTS version',
  'Write a REST API in Node.js',
];
