import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface InputConsoleProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const InputConsole: React.FC<InputConsoleProps> = ({ 
  onSubmit, 
  isLoading,
  placeholder = 'Enter your command...'
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black text-[#33ff33] border-2 border-[#33ff33] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#33ff33] font-mono"
          placeholder={placeholder}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#33ff33] text-black px-4 py-2 rounded hover:bg-[#66ff66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};