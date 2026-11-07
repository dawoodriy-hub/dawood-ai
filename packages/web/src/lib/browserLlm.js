import { MLCEngine } from '@mlc-ai/web-llm';
import { browserModelId } from './browserModels.js';

let engine;
let loadedModelId;
let reportProgress = () => {};

function getEngine(onProgress) {
  reportProgress = onProgress || (() => {});
  if (!engine) {
    engine = new MLCEngine({
      initProgressCallback: (progress) => reportProgress(progress.text || 'Preparing browser model…'),
    });
  }
  return engine;
}

export async function* streamBrowserChat({ messages, model, systemPrompt, signal, onProgress }) {
  if (!navigator.gpu) {
    throw new Error('Your browser does not support WebGPU, which is needed for free browser models.');
  }

  const modelId = browserModelId(model);
  const localEngine = getEngine(onProgress);
  if (loadedModelId !== modelId) {
    onProgress?.(`Downloading ${modelId} for the first time…`);
    await localEngine.reload(modelId);
    loadedModelId = modelId;
  }

  const chunks = await localEngine.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of chunks) {
    if (signal?.aborted) return;
    const text = chunk.choices[0]?.delta.content || '';
    if (text) yield { type: 'text', text };
  }
}
