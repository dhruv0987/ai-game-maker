import React from 'react';
import { OptionItem } from '../types';
import { COLORS } from '../constants';
import { CheckCircle } from 'lucide-react';
import * as SoundEngine from '../utils/soundEngine';

interface OptionSelectorProps {
  title: string;
  options: OptionItem[];
  onSelect: (option: OptionItem) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, options, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto p-4 animate-fade-in-up">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white neon-text">
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {options.map((option, index) => (
          <button
            key={option.id}
            onMouseEnter={() => SoundEngine.playHover()}
            onClick={() => {
              SoundEngine.playMagic(); // Special sound for selection
              onSelect(option);
            }}
            className="group relative flex flex-col items-center p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl text-left border-2 border-transparent hover:border-cyan-400"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              animationDelay: `${index * 150}ms`
            }}
          >
            <div 
              className="absolute -top-6 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform"
              style={{ backgroundColor: COLORS.primary, color: 'white' }}
            >
              {index + 1}
            </div>
            
            <h3 className="text-2xl font-bold mb-4 mt-4 text-white group-hover:text-cyan-400 transition-colors">
              {option.title}
            </h3>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {option.description}
            </p>
            
            <div className="mt-auto flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
              <CheckCircle size={16} className="mr-2" />
              Select this one!
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;
