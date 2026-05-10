import { Correction } from '../types';
import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface CorrectionCardProps {
  correction: Correction;
}

const typeLabels = {
  grammar: '语法错误',
  vocabulary: '词汇表达',
  pronunciation: '发音问题',
  tense: '时态错误',
  style: '表达方式',
};

const typeColors = {
  grammar: 'bg-red-50 border-red-200 text-red-700',
  vocabulary: 'bg-amber-50 border-amber-200 text-amber-700',
  pronunciation: 'bg-blue-50 border-blue-200 text-blue-700',
  tense: 'bg-purple-50 border-purple-200 text-purple-700',
  style: 'bg-green-50 border-green-200 text-green-700',
};

export default function CorrectionCard({ correction }: CorrectionCardProps) {
  const colorClass = typeColors[correction.type];
  
  return (
    <div className={`mt-2 p-4 rounded-xl border ${colorClass} animate-fade-in`}>
      <div className="flex items-start gap-2 mb-2">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">
            {typeLabels[correction.type]} 
          </p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="line-through opacity-70">{correction.original}</span>
          <span>→</span>
          <span className="font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            {correction.corrected}
          </span>
        </div>
        
        <div className="flex items-start gap-2 bg-white/50 p-2 rounded-lg">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">{correction.explanation}</p>
        </div>
      </div>
    </div>
  );
}
