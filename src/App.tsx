import React, { useState, useCallback } from 'react';
import { GenerationPanel } from './components/GenerationPanel';
import { GenerationControls } from './components/GenerationControls';
import { Metrics } from './components/Metrics';
import { SpinningGlobe } from './components/SpinningGlobe';
import { Brain, Power } from 'lucide-react';
import type { ModelState, ChatMessage } from './types';
import { useModelDebugger } from './services/model-debug';

const INITIAL_STATE: ModelState = {
  modelName: '',
  stage: 'training',
  metrics: {
    accuracy: 0,
    loss: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
  },
  history: [],
  lastUpdated: new Date().toISOString(),
};

function App() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [activeMode, setActiveMode] = useState<
    'text' | 'image' | 'chat' | 'settings'
  >('text');
  const [modelState, setModelState] = useState<ModelState>(INITIAL_STATE);
  const { analyzeModel, visualizeMetrics } = useModelDebugger(modelState);

  const handleInteraction = useCallback(
    async (input: string) => {
      setIsLoading(true);
      try {
        let response: string;

        if (activeMode === 'image') {
          const imageUrl = await visualizeMetrics(modelState.metrics);
          response = `Generated visualization: ![Model Metrics](${imageUrl})`;
        } else {
          response = await analyzeModel(input);
        }

        setHistory((prev) => [
          ...prev,
          { role: 'user', content: input, mode: activeMode },
          { role: 'assistant', content: response, mode: activeMode },
        ]);

        // Simulate metrics update
        setModelState((prev) => ({
          ...prev,
          metrics: {
            accuracy: Math.min(100, prev.metrics.accuracy + Math.random() * 5),
            loss: Math.max(0, prev.metrics.loss - Math.random() * 0.1),
            precision: Math.min(
              100,
              prev.metrics.precision + Math.random() * 3
            ),
            recall: Math.min(100, prev.metrics.recall + Math.random() * 4),
            f1Score: Math.min(100, prev.metrics.f1Score + Math.random() * 3),
          },
          lastUpdated: new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Model analysis error:', error);
        setHistory((prev) => [
          ...prev,
          {
            role: 'system',
            content: 'ERROR: Analysis failed. Please try again.',
            mode: activeMode,
          },
        ]);
      }
      setIsLoading(false);
    },
    [activeMode, analyzeModel, visualizeMetrics, modelState.metrics]
  );

  const handleFileUpload = useCallback(
    async (content: string, filename: string) => {
      setIsLoading(true);
      try {
        const response = await analyzeModel(
          `Analyze this ML file: ${filename}\n\nContent:\n${content}`
        );
        setHistory((prev) => [
          ...prev,
          {
            role: 'system',
            content: `Uploaded file: ${filename}`,
            mode: 'text',
          },
          { role: 'assistant', content: response, mode: 'text' },
        ]);
      } catch (error) {
        console.error('File analysis error:', error);
        setHistory((prev) => [
          ...prev,
          {
            role: 'system',
            content: 'ERROR: File analysis failed. Please try again.',
            mode: 'text',
          },
        ]);
      }
      setIsLoading(false);
    },
    [analyzeModel]
  );

  if (!isPoweredOn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <button
          onClick={() => setIsPoweredOn(true)}
          className="text-[#33ff33] border-2 border-[#33ff33] p-4 rounded-full hover:bg-[#33ff33] hover:text-black transition-all duration-300"
        >
          <Power size={48} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-[#33ff33]">
            <Brain size={24} />
            <h1 className="text-2xl font-mono">MODELTRON-8000</h1>
          </div>
          <button
            onClick={() => setIsPoweredOn(false)}
            className="text-[#33ff33] hover:text-[#ff3333] transition-colors"
          >
            <Power size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-3">
            <GenerationPanel
              mode={activeMode}
              messages={history}
              isLoading={isLoading}
              onInteraction={handleInteraction}
              onFileUpload={handleFileUpload}
            />
          </div>

          <div className="space-y-6">
            <GenerationControls
              activeMode={activeMode}
              onModeChange={setActiveMode}
            />
            <Metrics metrics={modelState.metrics} />
            <SpinningGlobe />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
