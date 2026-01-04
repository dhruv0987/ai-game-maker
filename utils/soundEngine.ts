import { COLORS } from '../constants';

let audioCtx: AudioContext | null = null;
let musicAudio: HTMLAudioElement | null = null;
let isMuted = false;
let masterGain: GainNode | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 0.3; // Global volume
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const setMute = (mute: boolean) => {
  isMuted = mute;
  if (musicAudio) {
    musicAudio.muted = mute;
  }
  if (masterGain) {
    masterGain.gain.setTargetAtTime(mute ? 0 : 0.3, audioCtx!.currentTime, 0.1);
  }
};

export const playBackgroundMusic = (url: string) => {
  if (!musicAudio) {
    musicAudio = new Audio(url);
    musicAudio.loop = true;
    musicAudio.volume = 0.4;
  }
  // Try to play - browsers might block until interaction
  const playPromise = musicAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log("Audio autoplay prevented. Waiting for user interaction.");
    });
  }
};

export const duckMusic = (duck: boolean) => {
  if (musicAudio) {
    // Lower volume when app is building or live for focus
    musicAudio.volume = duck ? 0.1 : 0.4;
  }
};

// --- SYNTHESIZED SOUND FX ---

// 1. Hover: High, short, airy pip
export const playHover = () => {
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(masterGain!);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
  
  gain.gain.setValueAtTime(0.05, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  
  osc.start(t);
  osc.stop(t + 0.05);
};

// 2. Click: Solid, punchy interaction
export const playClick = () => {
  initAudio(); // Ensure init on first click
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(masterGain!);
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
  
  gain.gain.setValueAtTime(0.3, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  
  osc.start(t);
  osc.stop(t + 0.1);
};

// 3. Success/Magic: Sparkly arpeggio
export const playMagic = () => {
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major chord
  
  notes.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    
    osc.connect(gain);
    gain.connect(masterGain!);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const startTime = t + (i * 0.05);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    
    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
};

// 4. Pop: Bubble sound for ingredients
export const playPop = () => {
  if (isMuted || !audioCtx) return;
  const t = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(masterGain!);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.linearRampToValueAtTime(800, t + 0.1);
  
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  
  osc.start(t);
  osc.stop(t + 0.1);
};
