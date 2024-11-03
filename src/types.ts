export interface ModelMetrics {
  accuracy: number;
  loss: number;
  precision: number;
  recall: number;
  f1Score: number;
  epochsCompleted: number;
  trainingTime: number;
  batchSize: number;
  learningRate: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  mode?: 'text' | 'image' | 'chat' | 'settings';
}

export interface ModelState {
  modelName: string;
  status: 'training' | 'evaluating' | 'idle' | 'error';
  metrics: ModelMetrics;
  history: ChatMessage[];
  currentEpoch: number;
  totalEpochs: number;
}