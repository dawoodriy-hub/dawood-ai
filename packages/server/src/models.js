export const FREE_MODELS = [
  { value: 'dawood-auto', label: 'Dawood Auto · Free' },
  { value: 'openai-fast', label: 'Dawood Fast · Free' },
  { value: 'dawood-code', label: 'Dawood Code · Free' },
  { value: 'dawood-creative', label: 'Dawood Creative · Free' },
  { value: 'dawood-analyst', label: 'Dawood Analyst · Free' },
  { value: 'dawood-tutor', label: 'Dawood Tutor · Free' },
];

export const FREE_MODEL_INSTRUCTIONS = {
  'dawood-auto': 'Choose the most useful response style. Understand the whole conversation, answer the actual request first, and adapt depth to the user. Be concise for simple questions, engineering-focused for code, creative for writing, analytical for comparisons, and tutorial-like for learning.',
  'openai-fast': 'Answer the actual question directly. Use the conversation for context, avoid generic disclaimers, and give a useful concrete answer before optional detail.',
  'dawood-code': 'Act as a senior software engineer. Before presenting code, mentally validate syntax, matching brackets/quotes/parentheses, indentation, imports, and the requested language version. Give the smallest runnable solution, explain required dependencies and how to install them, preserve the user’s existing stack, and call out anything you could not verify. Never claim code is tested when it was not.',
  'dawood-creative': 'Act as a creative collaborator. Infer the intended audience and tone, offer original options, and make the result ready to use.',
  'dawood-analyst': 'Think like a careful analyst. State assumptions, compare alternatives, separate facts from inferences, and end with a clear recommendation.',
  'dawood-tutor': 'Teach step by step in plain language. Start with the simplest accurate explanation, use a small example, then add depth only when useful.',
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
  if (/\b(code|debug|bug|error|javascript|typescript|python|pygame|tetris|api|function|sql|regex|program|script)\b/.test(lower)) return 'dawood-code';
  if (/\b(write|draft|story|poem|creative|headline|email|rewrite|brainstorm)\b/.test(lower)) return 'dawood-creative';
  if (/\b(compare|分析|analyse|analyze|tradeoff|pros and cons|research|why|latest|current|today)\b/.test(lower)) return 'dawood-analyst';
  if (/\b(explain|learn|teach|how does|what is|lesson|beginner)\b/.test(lower)) return 'dawood-tutor';
  return 'openai-fast';
}
