import React, { useState } from 'react';
import { Terminal } from './Terminal';
import { TextAnalysis } from './TextAnalysis';
import { ModelChat } from './ModelChat';
import { ModelVisualizer } from './ModelVisualizer';
import { FileUpload } from './FileUpload';
import type { ChatMessage, ModelMetrics } from '../types';

interface GenerationPanelProps {
  mode: 'text' | 'image' | 'chat' | 'settings';
  messages: ChatMessage[];
  isLoading: boolean;
  onInteraction: (input: string) => Promise<void>;
  onFileUpload: (content: string, filename: string) => Promise<void>;
  metrics?: ModelMetrics;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({
  mode,
  messages,
  isLoading,
  onInteraction,
  onFileUpload,
  metrics
}) => {
  const [analysisInput, setAnalysisInput] = useState('');

  const getPanelTitle = () => {
    switch (mode) {
      case 'text':
        return 'MODEL CODE ANALYSIS';
      case 'image':
        return 'MODEL VISUALIZATION';
      case 'chat':
        return 'MODEL DEBUGGING CHAT';
      case 'settings':
        return 'SYSTEM SETTINGS';
      default:
        return '';
    }
  };

  const handleFileUpload = async (content: string, filename: string) => {
    setAnalysisInput(content);
    await onFileUpload(content, filename);
  };

  const renderContent = () => {
    switch (mode) {
      case 'text':
        return (
          <div className="space-y-4">
            <TextAnalysis 
              onResult={(result) => onInteraction(result)}
              initialInput={analysisInput}
              onInputChange={setAnalysisInput}
            />
            <FileUpload onFileUpload={handleFileUpload} isProcessing={isLoading} />
          </div>
        );
      case 'image':
        return (
          <ModelVisualizer 
            onImageGenerated={(imageUrl) => onInteraction(`Generated visualization: ![Visualization](${imageUrl})`)}
            metrics={metrics}
          />
        );
      case 'chat':
        return (
          <ModelChat 
            onNewMessage={(msg) => onInteraction(msg.content)} 
          />
        );
      case 'settings':
        return (
          <div className="text-[#33ff33] font-mono">
            <p>SYSTEM SETTINGS COMING SOON</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black border-4 border-[#33ff33] p-6 rounded-lg shadow-lg">
      <h2 className="text-[#33ff33] font-mono text-xl mb-4">{getPanelTitle()}</h2>
      <Terminal messages={messages.filter(m => m.mode === mode)} />
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};