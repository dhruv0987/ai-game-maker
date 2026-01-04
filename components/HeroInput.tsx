import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { COLORS, SAMPLE_IDEAS } from '../constants';

interface HeroInputProps {
  onSubmit: (idea: string) => void;
}

const HeroInput: React.FC<HeroInputProps> = ({ onSubmit }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) onSubmit(idea);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 filter drop-shadow-lg">
          The AI App Factory
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          Dream it. Build it. Play it. <br/>
          <span className="text-sm opacity-70">A magical workshop for future coders.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-gray-900 rounded-2xl p-2 border border-gray-700 focus-within:border-cyan-500 transition-colors">
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="I want a game about..."
            className="flex-grow bg-transparent text-white text-xl p-4 focus:outline-none placeholder-gray-500 font-medium"
            autoFocus
          />
          <button
            type="submit"
            disabled={!idea.trim()}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white p-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
          >
            <span>Build</span>
            <Rocket size={24} />
          </button>
        </div>
      </form>

      <div className="mt-12">
        <p className="text-gray-400 mb-4 text-sm uppercase tracking-wider font-bold">Try these ideas:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {SAMPLE_IDEAS.map((sample) => (
            <button
              key={sample}
              onClick={() => setIdea(sample)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-cyan-300 border border-cyan-900 hover:border-cyan-500 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroInput;
