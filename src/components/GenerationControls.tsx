import React from 'react';
import { MessageSquare, Image, FileText, Settings } from 'lucide-react';

interface GenerationControlsProps {
  activeMode: 'text' | 'image' | 'chat' | 'settings';
  onModeChange: (mode: 'text' | 'image' | 'chat' | 'settings') => void;
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({ 
  activeMode, 
  onModeChange 
}) => {
  const controls = [
    { mode: 'text' as const, icon: FileText, label: 'TEXT ANALYSIS' },
    { mode: 'image' as const, icon: Image, label: 'VISUALIZATIONS' },
    { mode: 'chat' as const, icon: MessageSquare, label: 'MODEL CHAT' },
    { mode: 'settings' as const, icon: Settings, label: 'SETTINGS' }
  ];

  return (
    <div className="bg-black border-4 border-[#33ff33] p-4 rounded-lg">
      <h2 className="text-[#33ff33] font-mono text-lg mb-4">GENERATION MODE</h2>
      <div className="space-y-2">
        {controls.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`w-full flex items-center gap-2 p-2 rounded transition-colors ${
              activeMode === mode
                ? 'bg-[#33ff33] text-black'
                : 'text-[#33ff33] hover:bg-[#33ff33] hover:text-black'
            }`}
          >
            <Icon size={16} />
            <span className="font-mono text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};