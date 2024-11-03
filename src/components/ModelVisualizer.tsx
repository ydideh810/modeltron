import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, Activity, Loader } from 'lucide-react';
import { usePollinationsImage } from '@pollinations/react';
import type { ModelMetrics } from '../types';

interface ModelVisualizerProps {
  onImageGenerated: (imageUrl: string) => void;
  metrics?: ModelMetrics;
}

const DEFAULT_METRICS: ModelMetrics = {
  accuracy: 0,
  loss: 0,
  precision: 0,
  recall: 0,
  f1Score: 0,
  epochsCompleted: 0,
  trainingTime: 0,
  batchSize: 32,
  learningRate: 0.001
};

export const ModelVisualizer: React.FC<ModelVisualizerProps> = ({ 
  onImageGenerated, 
  metrics = DEFAULT_METRICS 
}) => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie' | 'custom'>('bar');
  const [customPrompt, setCustomPrompt] = useState('');

  const getVisualizationPrompt = () => {
    const baseMetrics = `
      Accuracy: ${metrics.accuracy.toFixed(2)}%
      Loss: ${metrics.loss.toFixed(4)}
      Precision: ${metrics.precision.toFixed(2)}%
      Recall: ${metrics.recall.toFixed(2)}%
      F1 Score: ${metrics.f1Score.toFixed(2)}%
      Training Time: ${metrics.trainingTime}s
    `;

    switch (selectedChart) {
      case 'bar':
        return `Create a modern, minimalist bar chart visualization showing ML model metrics:${baseMetrics}. Use a dark background with neon green (#33ff33) bars and white labels. Include a title and axis labels. Make it look like it's from the 1980s.`;
      case 'line':
        return `Generate a retro-style line graph showing ML model metrics:${baseMetrics}. Use a dark background with neon green (#33ff33) lines and white grid lines. Include data points. Style it like a 1980s computer interface.`;
      case 'pie':
        return `Create a vintage-style pie chart showing ML model metric distribution:${baseMetrics}. Use a dark background with different shades of neon green and white labels. Include a legend. Make it look like it's from an old computer terminal.`;
      case 'custom':
        return customPrompt || 'A retro-style technical visualization with neon green elements on a dark background';
      default:
        return '';
    }
  };

  const imageUrl = usePollinationsImage(getVisualizationPrompt(), {
    width: 800,
    height: 400,
    seed: 42,
    model: 'flux',
    nologo: true,
    enhance: false
  });

  const chartTypes = [
    { type: 'custom' as const, icon: Activity, label: 'CUSTOM PLOT' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {chartTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setSelectedChart(type)}
            className={`flex flex-col items-center gap-2 p-3 rounded transition-colors ${
              selectedChart === type
                ? 'bg-[#33ff33] text-black'
                : 'text-[#33ff33] border border-[#33ff33] hover:bg-[#33ff33] hover:text-black'
            }`}
          >
            <Icon size={20} />
            <span className="font-mono text-xs">{label}</span>
          </button>
        ))}
      </div>

      {selectedChart === 'custom' && (
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full h-32 bg-black text-[#33ff33] border-2 border-[#33ff33] p-2 rounded font-mono"
          placeholder="Describe your custom visualization..."
        />
      )}

      <div className="border-2 border-[#33ff33] rounded-lg p-4 bg-black">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Model Visualization" 
            className="w-full h-auto rounded"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="flex items-center justify-center p-8">
            <Loader className="animate-spin text-[#33ff33]" size={32} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-[#33ff33] font-mono text-sm">
        <div>
          <h3 className="font-bold mb-2">CURRENT METRICS</h3>
          <div className="space-y-1">
            <p>Accuracy: {metrics.accuracy.toFixed(2)}%</p>
            <p>Loss: {metrics.loss.toFixed(4)}</p>
            <p>Precision: {metrics.precision.toFixed(2)}%</p>
            <p>Recall: {metrics.recall.toFixed(2)}%</p>
            <p>F1 Score: {metrics.f1Score.toFixed(2)}%</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-2">TRAINING INFO</h3>
          <div className="space-y-1">
            <p>Epochs: {metrics.epochsCompleted}</p>
            <p>Time: {metrics.trainingTime}s</p>
            <p>Batch Size: {metrics.batchSize}</p>
            <p>Learning Rate: {metrics.learningRate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};