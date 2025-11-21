import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const MESSAGES = [
  "Reading PDF content...",
  "Identifying key statistics...",
  "Extracting chart data...",
  "Summarizing main points...",
  "Designing your infographic...",
  "Adding finishing touches...",
];

export const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const corporateTheme = {
    primary: '#09122B',
    secondary: '#14B87C',
    surface: '#F5F7FA',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative">
        <div 
          className="absolute inset-0 blur-xl opacity-20 rounded-full animate-pulse"
          style={{ backgroundColor: corporateTheme.primary }}
        ></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl mb-8">
          <Loader2 
            className="w-12 h-12 animate-spin" 
            style={{ color: corporateTheme.primary }}
          />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Generating Infographic
      </h3>
      <p className="text-gray-500 text-lg min-h-[2rem] transition-opacity duration-300">
        {MESSAGES[messageIndex]}
      </p>
      
      <div 
        className="mt-8 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
        style={{ 
          color: corporateTheme.primary,
          backgroundColor: corporateTheme.surface
        }}
      >
        <Sparkles size={16} />
        <span>Powered by Gemini 2.5 Flash</span>
      </div>
    </div>
  );
};
