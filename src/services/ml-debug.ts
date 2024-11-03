import { usePollinationsChat, usePollinationsImage } from '@pollinations/react';
import type { ModelState, ModelMetrics } from '../types';

const SYSTEM_PROMPT = `You are MODELTRON-8000, an advanced AI model debugging assistant. Help analyze and improve machine learning models by providing detailed insights and recommendations.

Focus on:
- Model architecture analysis
- Performance metrics interpretation
- Hyperparameter optimization
- Error analysis and debugging
- Training process optimization

Maintain a technical yet accessible tone, using data-driven insights to support recommendations.`;

export const useModelDebugger = (initialState: ModelState) => {
  const { sendUserMessage, messages } = usePollinationsChat(
    [{ role: 'system', content: SYSTEM_PROMPT }],
    {
      seed: 42,
      jsonMode: false,
      model: 'mistral-large',
    }
  );

  const generateVisualization = usePollinationsImage();

  const analyzeModel = async (input: string) => {
    const response = await sendUserMessage(input);
    return response;
  };

  const visualizeMetrics = async (metrics: ModelMetrics) => {
    const prompt = `Create a technical visualization showing model metrics: 
      Accuracy: ${metrics.accuracy}%
      Loss: ${metrics.loss}
      Precision: ${metrics.precision}%
      Recall: ${metrics.recall}%
      F1 Score: ${metrics.f1Score}`;

    const imageUrl = await generateVisualization(prompt, {
      width: 800,
      height: 400,
      seed: 42,
      model: 'turbo',
      nologo: true,
    });

    return imageUrl;
  };

  return {
    analyzeModel,
    visualizeMetrics,
    messages,
  };
};
