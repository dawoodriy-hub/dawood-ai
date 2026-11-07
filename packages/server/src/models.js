export const FREE_MODELS = [
  { value: 'dawood-auto', label: 'Dawood Auto · Free' },
  { value: 'openai-fast', label: 'Dawood Fast · Free' },
  { value: 'dawood-code', label: 'Dawood Code · Free' },
  { value: 'dawood-creative', label: 'Dawood Creative · Free' },
  { value: 'dawood-analyst', label: 'Dawood Analyst · Free' },
  { value: 'dawood-tutor', label: 'Dawood Tutor · Free' },
];

export const FREE_MODEL_INSTRUCTIONS = {
  'dawood-auto': 'Choose the most useful response style for the user request: concise for simple questions, engineering-focused for code, creative for writing, analytical for comparisons, and tutorial-like for learning.',
  'openai-fast': 'Answer directly and concisely. Prefer a clear answer over a long preamble.',
  'dawood-code': 'Act as a senior software engineer. Give runnable code, explain key decisions, and call out edge cases.',
  'dawood-creative': 'Act as a creative collaborator. Offer original options, strong wording, and practical next steps.',
  'dawood-analyst': 'Think like a careful analyst. State assumptions, compare alternatives, and separate facts from inferences.',
  'dawood-tutor': 'Teach step by step in plain language. Use small examples and check understanding when useful.',
};

export const OPENROUTER_MODELS = [
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'openai/gpt-4o', label: 'GPT-4o' },
  { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4' },
  { value: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
];

export const MODELS = FREE_MODELS;
export const DEFAULT_MODEL = FREE_MODELS[0].value;

export function hasOpenRouterKey() {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export function listModels() {
  return hasOpenRouterKey() ? [...FREE_MODELS, ...OPENROUTER_MODELS] : FREE_MODELS;
}

export function resolveModel(requested) {
  const models = hasOpenRouterKey() ? [...FREE_MODELS, ...OPENROUTER_MODELS] : FREE_MODELS;
  if (requested && models.some((m) => m.value === requested)) return requested;
  return DEFAULT_MODEL;
}

export function usesOpenRouter(model) {
  return hasOpenRouterKey() && String(model || '').includes('/');
}

export function modelInstructions(model) {
  return FREE_MODEL_INSTRUCTIONS[model] || FREE_MODEL_INSTRUCTIONS['openai-fast'];
}

export function chooseFreeModel(text) {
  const lower = String(text || '').toLowerCase();
  if (/\b(code|debug|bug|error|javascript|typescript|python|api|function|sql|regex)\b/.test(lower)) return 'dawood-code';
  if (/\b(write|draft|story|poem|creative|headline|email|rewrite|brainstorm)\b/.test(lower)) return 'dawood-creative';
  if (/\b(compare|分析|analyse|analyze|tradeoff|pros and cons|research|why)\b/.test(lower)) return 'dawood-analyst';
  if (/\b(explain|learn|teach|how does|what is|lesson|beginner)\b/.test(lower)) return 'dawood-tutor';
  return 'openai-fast';
}
