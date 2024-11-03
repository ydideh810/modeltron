import React, { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import type { ChatMessage } from '../types';

interface TerminalProps {
  messages: ChatMessage[];
}

export const Terminal: React.FC<TerminalProps> = ({ messages }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={terminalRef}
      className="font-mono text-[#33ff33] bg-black p-4 rounded-lg shadow-inner h-[500px] border-2 border-[#33ff33] overflow-y-auto"
    >
      {messages.map((message, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span className="text-[#33ff33] opacity-75">{message.role}:</span>
          </div>
          <div className="ml-6 mt-2">
            <pre className="font-mono text-[#33ff33] whitespace-pre-wrap break-words">
              {message.content}
            </pre>
            {message.timestamp && (
              <div className="text-xs opacity-50 mt-1">{message.timestamp}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}