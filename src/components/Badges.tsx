import React from 'react';
import { Award } from 'lucide-react';
import type { Badge } from '../types';

interface BadgesProps {
  badges: string[];
}

export const Badges: React.FC<BadgesProps> = ({ badges }) => {
  return (
    <div className="bg-black border-4 border-[#33ff33] p-4 rounded-lg">
      <h2 className="text-[#33ff33] font-mono text-lg mb-4">ACHIEVEMENTS</h2>
      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-[#33ff33] p-2 border border-[#33ff33] rounded"
          >
            <Award size={16} />
            <span className="font-mono text-xs">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}