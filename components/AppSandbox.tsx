import React, { useRef } from 'react';
import { RefreshCcw, Smartphone, Monitor, Maximize2 } from 'lucide-react';
import { COLORS } from '../constants';

interface AppSandboxProps {
  code: string;
  onRestart: () => void;
}

const AppSandbox: React.FC<AppSandboxProps> = ({ code, onRestart }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = React.useState<'mobile' | 'desktop' | 'full'>('desktop');

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile': return '375px'; // iPhone width
      case 'desktop': return '100%';
      case 'full': return '100vw';
      default: return '100%';
    }
  };

  const isFull = deviceMode === 'full';

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full ${isFull ? 'fixed inset-0 z-50 bg-black' : 'max-w-6xl mx-auto p-4'}`}>
      
      {/* Control Bar */}
      <div className={`w-full flex justify-between items-center mb-4 ${isFull ? 'absolute top-4 left-4 right-4 z-50 pointer-events-none' : ''}`}>
        <div className={`flex gap-2 ${isFull ? 'pointer-events-auto bg-black/50 p-2 rounded-lg backdrop-blur' : ''}`}>
           <button 
             onClick={onRestart}
             className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white transition-colors hover:bg-white/20"
             style={{ backgroundColor: isFull ? 'transparent' : COLORS.primary }}
           >
             <RefreshCcw size={18} />
             {!isFull && "Build Another App"}
           </button>
        </div>

        <div className={`flex gap-2 bg-white/10 p-1 rounded-lg backdrop-blur ${isFull ? 'pointer-events-auto' : ''}`}>
           <button 
             onClick={() => setDeviceMode('mobile')} 
             className={`p-2 rounded hover:bg-white/10 ${deviceMode === 'mobile' ? 'bg-white/20 text-cyan-400' : 'text-white'}`}
             title="Mobile View"
           >
             <Smartphone size={20} />
           </button>
           <button 
             onClick={() => setDeviceMode('desktop')} 
             className={`p-2 rounded hover:bg-white/10 ${deviceMode === 'desktop' ? 'bg-white/20 text-cyan-400' : 'text-white'}`}
             title="Desktop View"
           >
             <Monitor size={20} />
           </button>
           <button 
             onClick={() => setDeviceMode(isFull ? 'desktop' : 'full')} 
             className={`p-2 rounded hover:bg-white/10 ${isFull ? 'bg-white/20 text-cyan-400' : 'text-white'}`}
             title="Fullscreen"
           >
             <Maximize2 size={20} />
           </button>
        </div>
      </div>

      {/* Iframe Container */}
      <div 
        className={`relative transition-all duration-500 ease-in-out shadow-2xl overflow-hidden ${isFull ? 'w-full h-full rounded-none' : 'h-[600px] rounded-2xl border-4 border-gray-800'}`}
        style={{ width: getContainerWidth() }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={code}
          title="Generated App"
          className="w-full h-full bg-white"
          sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin" // Relaxed slightly for more interactive apps, but typically allow-scripts is minimum
          allow="camera; microphone; geolocation" // Pass through permissions if requested
        />
      </div>

      {!isFull && (
        <p className="mt-4 text-gray-400 text-sm">
          Warning: AI generated code can be unpredictable. If it freezes, click "Build Another App".
        </p>
      )}
    </div>
  );
};

export default AppSandbox;
