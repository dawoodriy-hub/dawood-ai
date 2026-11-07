export const BROWSER_MODELS = [
  {
    value: 'webllm:Qwen3-0.6B-q4f16_1-MLC',
    label: 'Qwen 3 Mini (Browser · Free)',
  },
  {
    value: 'webllm:Llama-3.2-1B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 1B (Browser · Free)',
  },
  {
    value: 'webllm:DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    label: 'DeepSeek R1 1.5B (Browser · Free)',
  },
];

export function isBrowserModel(model) {
  return typeof model === 'string' && model.startsWith('webllm:');
}

export function browserModelId(model) {
  return model.slice('webllm:'.length);
}
