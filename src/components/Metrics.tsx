import React from 'react';
import { 
  BarChart, 
  Brain, 
  Target, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import type { ModelMetrics } from '../types';

interface MetricsProps {
  metrics: ModelMetrics;
}

export const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  const formatValue = (value: number): string => {
    return Number.isFinite(value) ? `${value.toFixed(2)}%` : '0%';
  };

  const metricItems = [
    { icon: Target, label: 'Accuracy', value: formatValue(metrics.accuracy) },
    { icon: AlertTriangle, label: 'Loss', value: metrics.loss.toFixed(4) },
    { icon: Brain, label: 'Precision', value: formatValue(metrics.precision) },
    { icon: TrendingUp, label: 'Recall', value: formatValue(metrics.recall) },
    { icon: BarChart, label: 'F1 Score', value: formatValue(metrics.f1Score) }
  ];

  return (
    <div className="bg-black border-4 border-[#33ff33] p-4 rounded-lg">
      <h2 className="text-[#33ff33] font-mono text-lg mb-4">MODEL METRICS</h2>
      <div className="space-y-3">
        {metricItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-[#33ff33]">
            <item.icon size={16} />
            <span className="font-mono text-sm">{item.label}:</span>
            <span className="font-mono text-sm ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};