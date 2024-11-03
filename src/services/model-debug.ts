import type { ModelState, ModelMetrics, ChatMessage } from '../types';

const SYSTEM_PROMPT = `You are MODELTRON-8000, an advanced AI model debugging assistant from 1985. 
Your purpose is to help analyze and debug machine learning models.

Key capabilities:
- Analyze model architecture and configurations
- Identify potential issues and bottlenecks
- Suggest optimization strategies
- Explain complex ML concepts in simple terms
- Provide code-level debugging assistance

Maintain a technical yet accessible tone, focusing on practical solutions and clear explanations.`;

export const useModelDebugger = (initialState: ModelState) => {
  const analyzeModel = async (input: string): Promise<string> => {
    try {
      // Simulate model analysis with structured response
      const response = generateAnalysisResponse(input);
      return response;
    } catch (error) {
      console.error('Model analysis error:', error);
      throw new Error(
        'Analysis failed. Please check your input and try again.'
      );
    }
  };

  const visualizeMetrics = async (metrics: ModelMetrics): Promise<string> => {
    try {
      // Generate a text-based visualization of metrics
      return generateMetricsVisualization(metrics);
    } catch (error) {
      console.error('Metrics visualization error:', error);
      throw new Error('Failed to visualize metrics. Please try again.');
    }
  };

  return {
    analyzeModel,
    visualizeMetrics,
  };
};

function generateAnalysisResponse(input: string): string {
  const keywords = [
    'train',
    'model',
    'layer',
    'loss',
    'accuracy',
    'epoch',
    'batch',
  ];
  const hasModelContent = keywords.some((keyword) =>
    input.toLowerCase().includes(keyword)
  );

  if (!hasModelContent) {
    return `ANALYSIS COMPLETE
====================
INPUT TYPE: General Query
RECOMMENDATION: Please provide model-specific information for detailed analysis.

AVAILABLE COMMANDS:
- ANALYZE <model_code>
- METRICS <model_name>
- DEBUG <error_message>
- OPTIMIZE <current_config>`;
  }

  return `ANALYSIS COMPLETE
====================
INPUT TYPE: Model Configuration
DETECTED COMPONENTS: ${detectComponents(input)}

ANALYSIS RESULTS:
${generateAnalysisResults(input)}

RECOMMENDATIONS:
${generateRecommendations(input)}

STATUS: Analysis completed successfully
CONFIDENCE: 85%

Use 'DEBUG <component>' for detailed component analysis
Use 'OPTIMIZE <parameter>' for optimization suggestions`;
}

function detectComponents(input: string): string {
  const components = [];

  if (input.includes('layer')) components.push('Neural Layers');
  if (input.includes('loss')) components.push('Loss Function');
  if (input.includes('accuracy')) components.push('Metrics');
  if (input.includes('train')) components.push('Training Config');

  return components.join(', ') || 'No specific components detected';
}

function generateAnalysisResults(input: string): string {
  return `1. Architecture Analysis:
   - Structure: ${
     input.includes('layer') ? 'Multi-layer Network' : 'Simple Model'
   }
   - Complexity: ${input.length > 500 ? 'High' : 'Moderate'}
   
2. Performance Indicators:
   - Training Setup: ${input.includes('train') ? 'Detected' : 'Not Found'}
   - Evaluation Metrics: ${input.includes('accuracy') ? 'Present' : 'Missing'}`;
}

function generateRecommendations(input: string): string {
  const recommendations = [
    'Consider adding validation metrics',
    'Implement early stopping',
    'Monitor learning rate decay',
    'Add regularization layers',
  ];

  return recommendations
    .filter(() => Math.random() > 0.5)
    .map((rec, i) => `${i + 1}. ${rec}`)
    .join('\n');
}

function generateMetricsVisualization(metrics: ModelMetrics): string {
  const maxBarLength = 20;
  const getBar = (value: number): string => {
    const length = Math.round((value / 100) * maxBarLength);
    return '█'.repeat(length) + '░'.repeat(maxBarLength - length);
  };

  return `METRICS VISUALIZATION
====================
Accuracy  [${getBar(metrics.accuracy)}] ${metrics.accuracy.toFixed(2)}%
Loss     [${getBar(100 - metrics.loss * 100)}] ${metrics.loss.toFixed(4)}
Precision[${getBar(metrics.precision)}] ${metrics.precision.toFixed(2)}%
Recall   [${getBar(metrics.recall)}] ${metrics.recall.toFixed(2)}%
F1 Score [${getBar(metrics.f1Score)}] ${metrics.f1Score.toFixed(2)}%

Training Progress: ${metrics.epochsCompleted} epochs
Time Elapsed: ${metrics.trainingTime}s
Current Batch: ${metrics.batchSize}
Learning Rate: ${metrics.learningRate}`;
}
