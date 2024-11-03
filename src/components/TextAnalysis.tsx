import React, { useState, useEffect } from 'react';
import { usePollinationsText } from '@pollinations/react';

interface TextAnalysisProps {
  onResult: (result: string) => void;
  initialInput?: string;
  onInputChange?: (input: string) => void;
}

export const TextAnalysis: React.FC<TextAnalysisProps> = ({ 
  onResult, 
  initialInput = '', 
  onInputChange 
}) => {
  const [input, setInput] = useState(initialInput);
  const text = usePollinationsText(input ? `Analyze this ML code or configuration:\n${input}` : null, {
    seed: 42,
    model: 'mistral-large',
    systemPrompt: 'You are an expert ML code analyzer. Provide detailed insights about model architecture, potential issues, and optimization suggestions.'
  });

  useEffect(() => {
    setInput(initialInput);
  }, [initialInput]);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };

  const handleSubmit = () => {
    if (text) {
      onResult(text);
      setInput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full h-32 bg-black text-[#33ff33] border-2 border-[#33ff33] p-2 rounded font-mono"
        placeholder="Paste your ML code or configuration here..."
      />
      <button
        onClick={handleSubmit}
        disabled={!text || !input}
        className="bg-[#33ff33] text-black px-4 py-2 rounded font-mono hover:bg-[#66ff66] disabled:opacity-50"
      >
        ANALYZE CODE
      </button>
    </div>
  );
};