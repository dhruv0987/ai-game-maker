import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { COLORS, LOFI_MUSIC_URL } from '../constants';
import * as SoundEngine from '../utils/soundEngine';

const AudioControl: React.FC = () => {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Attempt to start music on first user interaction with the document
    const handleFirstInteraction = () => {
      if (!started) {
        SoundEngine.playBackgroundMusic(LOFI_MUSIC_URL);
        SoundEngine.playClick(); // Initial click sound
        setStarted(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [started]);

  const toggleMute = () => {
    const newMuteState = !muted;
    setMuted(newMuteState);
    SoundEngine.setMute(newMuteState);
    if (!newMuteState) SoundEngine.playClick();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={toggleMute}
        className="p-3 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200 flex items-center justify-center bg-gray-800 border border-gray-600 hover:border-cyan-400"
        title={muted ? "Unmute Audio" : "Mute Audio"}
      >
        {muted ? (
          <VolumeX size={24} className="text-gray-400" />
        ) : (
          <Volume2 size={24} className="text-cyan-400 animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default AudioControl;
