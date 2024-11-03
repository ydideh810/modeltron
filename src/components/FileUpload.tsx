import React, { useCallback, useState } from 'react';
import { FileUp, Loader, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, filename: string) => Promise<void>;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const supportedFormats = [
    '.py', '.ipynb', '.h5', '.pkl', '.model', 
    '.pth', '.onnx', '.pb', '.json', '.yaml', 
    '.csv', '.txt', '.md'
  ];

  const clearError = () => setError(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!supportedFormats.includes(fileExt)) {
      setError(`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await onFileUpload(content, file.name);
        setError(null);
      } catch (error) {
        setError('Error processing file. Please try again.');
        console.error('Error processing file:', error);
      }
    };

    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  }, [onFileUpload, supportedFormats]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="file"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={supportedFormats.join(',')}
          disabled={isProcessing}
        />
        <button
          className={`flex items-center gap-2 bg-black text-[#33ff33] border-2 border-[#33ff33] px-4 py-2 rounded hover:bg-[#33ff33] hover:text-black transition-colors ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader className="animate-spin" size={16} />
          ) : (
            <FileUp size={16} />
          )}
          <span className="font-mono text-sm">ATTACH ML FILE</span>
        </button>
        
        {selectedFile && (
          <div className="flex items-center gap-2 text-[#33ff33] border border-[#33ff33] rounded px-2 py-1">
            <span className="font-mono text-xs truncate max-w-[150px]">
              {selectedFile.name}
            </span>
            <button 
              onClick={() => setSelectedFile(null)}
              className="hover:text-[#ff3333]"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute top-full left-0 mt-2 text-[#ff3333] text-sm font-mono flex items-center gap-2">
          <span>{error}</span>
          <button 
            onClick={clearError}
            className="hover:text-[#ff6666]"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};