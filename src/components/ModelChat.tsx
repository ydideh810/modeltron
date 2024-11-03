import React, { useState, useCallback } from 'react';
import { usePollinationsChat } from '@pollinations/react';
import { FileUpload } from './FileUpload';
import { AlertCircle, Send, FileText } from 'lucide-react';

interface ModelChatProps {
  onNewMessage: (message: { role: string; content: string }) => void;
}

interface ChatMessage {
  role: string;
  content: string;
  timestamp?: string;
}

const SYSTEM_PROMPT = `You are MODELTRON-8000, an advanced AI model debugging assistant from 1985. 
Your purpose is to help analyze and debug machine learning models.

Key capabilities:
- Analyze model architecture and configurations
- Identify potential issues and bottlenecks
- Suggest optimization strategies
- Explain complex ML concepts in simple terms
- Provide code-level debugging assistance

Maintain a technical yet accessible tone, focusing on practical solutions and clear explanations.`;

export const ModelChat: React.FC<ModelChatProps> = ({ onNewMessage }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<{
    name: string;
    content: string;
  } | null>(null);

  const { sendUserMessage, messages } = usePollinationsChat(
    [{ role: 'system', content: SYSTEM_PROMPT }],
    {
      seed: 42,
      model: 'openai',
      temperature: 0.7,
    }
  );

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      onNewMessage({
        role: 'system',
        content: `ERROR: ${errorMessage}`,
      });
      setTimeout(() => setError(null), 5000);
    },
    [onNewMessage]
  );

  const handleFileUpload = useCallback(
    async (content: string, filename: string) => {
      setIsProcessing(true);
      setError(null);

      try {
        setCurrentFile({ name: filename, content });

        const fileContext = `Analyzing ML file: ${filename}\n\nContent:\n${content}`;
        await sendUserMessage(fileContext);

        onNewMessage({
          role: 'system',
          content: `File uploaded: ${filename}`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        handleError('File analysis failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    },
    [sendUserMessage, onNewMessage, handleError]
  );

  const handleSend = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const context = currentFile
        ? `Regarding model file ${currentFile.name}: ${input}`
        : input;

      await sendUserMessage(context);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      handleError('Failed to process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [input, isProcessing, currentFile, sendUserMessage, handleError]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="w-full bg-black text-[#33ff33] border-2 border-[#33ff33] p-2 rounded font-mono"
            placeholder={
              currentFile
                ? `Ask about ${currentFile.name}...`
                : 'Upload a model file to begin analysis...'
            }
            disabled={isProcessing}
          />
          {error && (
            <div className="absolute top-full left-0 mt-1 flex items-center gap-2 text-red-500 text-sm font-mono">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
          className="bg-[#33ff33] text-black px-4 py-2 rounded font-mono hover:bg-[#66ff66] disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={16} />
          <span>SEND</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <FileUpload
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
          accept=".py,.ipynb,.h5,.pkl,.model,.pth,.onnx,.pb"
        />

        {currentFile && (
          <div className="text-[#33ff33] font-mono text-sm flex items-center gap-2">
            <FileText size={14} />
            <span>Active Model: {currentFile.name}</span>
          </div>
        )}
      </div>

      <div className="border-2 border-[#33ff33] rounded p-4 h-[400px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-[#33ff33] text-black'
                  : 'bg-black text-[#33ff33] border border-[#33ff33]'
              } rounded p-2 font-mono`}
            >
              <pre className="whitespace-pre-wrap break-words text-sm">
                {msg.content}
              </pre>
              {msg.timestamp && (
                <div className="text-xs opacity-50 mt-1">
                  {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
