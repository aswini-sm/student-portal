import React from 'react';
import { BookOpen, Calculator, Globe, FlaskConical, ScrollText } from 'lucide-react';

const icons = {
  Math: Calculator,
  Science: FlaskConical,
  English: BookOpen,
  History: ScrollText,
  Geography: Globe,
};

const ResultCard = ({ subject, marks }) => {
  const Icon = icons[subject] || BookOpen;
  
  // Dynamic color selection based on score percentage
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const colors = getScoreColor(marks);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors.split(' ')[1]} ${colors.split(' ')[0]} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <span className="block text-3xl font-bold text-gray-900">{marks}</span>
          <span className="text-xs font-medium text-gray-400">/ 100</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-800 text-lg mb-4">{subject}</h3>
      
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full ${getProgressColor(marks)} transition-all duration-1000 ease-out origin-left`}
          style={{ width: `${marks}%` }}
        />
      </div>
    </div>
  );
};

export default ResultCard;
