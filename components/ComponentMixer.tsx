import React, { useState, useEffect } from 'react';
import { Box, Image, Music, Zap, Star } from 'lucide-react';
import { COLORS } from '../constants';
import * as SoundEngine from '../utils/soundEngine';

interface ComponentMixerProps {
  message: string;
}

const Ingredient = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    onMouseEnter={() => SoundEngine.playHover()}
    className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing border border-white/20"
  >
    <Icon size={32} className="mb-2 text-white" />
    <span className="text-xs font-bold text-gray-200">{label}</span>
  </button>
);

const Particle = ({ x, y, color }: { x: number, y: number, color: string }) => (
  <div 
    className="absolute w-3 h-3 rounded-full animate-ping"
    style={{ left: x, top: y, backgroundColor: color }}
  />
);

const ComponentMixer: React.FC<ComponentMixerProps> = ({ message }) => {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const [count, setCount] = useState(0);

  const addIngredient = (e: React.MouseEvent) => {
    SoundEngine.playPop(); // Play sound!
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticle = {
      id: Date.now(),
      x: Math.random() * 200 + 50, // Center-ish relative to container
      y: Math.random() * 200 + 50,
      color: [COLORS.primary, COLORS.secondary, '#FF00FF'][Math.floor(Math.random() * 3)]
    };

    setParticles(prev => [...prev, newParticle]);
    setCount(prev => prev + 1);

    // Cleanup particle
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-center animate-pulse" style={{ color: COLORS.secondary }}>
        {message}
      </h2>

      <div className="flex flex-col md:flex-row gap-12 items-center">
        {/* Ingredients Shelf */}
        <div className="grid grid-cols-2 gap-4">
          <Ingredient icon={Box} label="Button" onClick={() => addIngredient({ clientX: 0, clientY: 0, target: document.body } as any)} />
          <Ingredient icon={Image} label="Image" onClick={() => addIngredient({ clientX: 0, clientY: 0, target: document.body } as any)} />
          <Ingredient icon={Music} label="Sound" onClick={() => addIngredient({ clientX: 0, clientY: 0, target: document.body } as any)} />
          <Ingredient icon={Zap} label="Logic" onClick={() => addIngredient({ clientX: 0, clientY: 0, target: document.body } as any)} />
        </div>

        {/* The Mixer Jar */}
        <div className="relative w-64 h-64 md:w-80 md:h-80">
           {/* Jar Body */}
           <div 
            className="absolute inset-0 rounded-b-full border-4 border-white/30 backdrop-blur-md overflow-hidden flex items-end justify-center pb-8"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.2))' }}
           >
             <div className="text-center z-10">
               <span className="text-4xl font-bold text-white drop-shadow-lg">{count}</span>
               <p className="text-sm text-gray-200">Components Added</p>
             </div>

             {/* Swirling Liquid Animation */}
             <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-purple-600 to-transparent opacity-50 animate-pulse"></div>
           </div>
           
           {/* Particles */}
           {particles.map(p => (
             <div 
                key={p.id}
                className="absolute w-4 h-4 rounded-full transition-all duration-700 ease-in"
                style={{ 
                  backgroundColor: p.color,
                  left: `${Math.random() * 80 + 10}%`,
                  top: '10%',
                  animation: 'drop 0.8s forwards'
                }}
             />
           ))}

           {/* Jar Rim */}
           <div className="absolute top-0 left-0 right-0 h-4 bg-white/40 rounded-full"></div>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm max-w-md text-center">
        Tip: Click the ingredients to help the AI build faster! 
        (Not really, but it's fun!)
      </div>

      <style>{`
        @keyframes drop {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(250px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ComponentMixer;
