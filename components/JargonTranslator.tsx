import React, { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import { COLORS, INITIAL_JARGON } from '../constants';

interface JargonTranslatorProps {
  currentTip?: string; // An optional specific tip from the current state
}

const JargonTranslator: React.FC<JargonTranslatorProps> = ({ currentTip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTerm, setActiveTerm] = useState(INITIAL_JARGON[0]);

  useEffect(() => {
    // Rotate terms occasionally if closed, or if no specific tip
    if (!currentTip) {
      const interval = setInterval(() => {
        const randomTerm = INITIAL_JARGON[Math.floor(Math.random() * INITIAL_JARGON.length)];
        setActiveTerm(randomTerm);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [currentTip]);

  const displayContent = currentTip 
    ? { term: "Developer Tip", definition: currentTip } 
    : activeTerm;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div 
          className="mb-4 p-4 rounded-xl shadow-2xl w-64 md:w-80 transform transition-all duration-300 animate-slide-up border-2"
          style={{ 
            backgroundColor: COLORS.background, 
            borderColor: COLORS.secondary,
            boxShadow: `0 0 20px ${COLORS.primary}40`
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg" style={{ color: COLORS.secondary }}>
              {displayContent.term}
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {displayContent.definition}
          </p>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200 flex items-center justify-center animate-bounce-slow"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Lightbulb size={24} color="white" fill="white" />
      </button>
    </div>
  );
};

export default JargonTranslator;
