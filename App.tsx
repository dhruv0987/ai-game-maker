import React, { useState, useEffect } from 'react';
import { AppState, AppStage, OptionItem } from './types';
import { COLORS } from './constants';
import * as Gemini from './services/geminiService';
import * as SoundEngine from './utils/soundEngine';

// Components
import HeroInput from './components/HeroInput';
import OptionSelector from './components/OptionSelector';
import ComponentMixer from './components/ComponentMixer';
import AppSandbox from './components/AppSandbox';
import JargonTranslator from './components/JargonTranslator';
import AudioControl from './components/AudioControl';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    stage: 'IDLE',
    userIdea: '',
    selectedDesign: null,
    selectedLogic: null,
    generatedCode: null,
    designOptions: [],
    logicOptions: [],
    loading: false,
    loadingMessage: '',
  });

  // Duck music when in the build/live phase to allow the user to focus or hear their own app
  useEffect(() => {
    SoundEngine.duckMusic(state.stage === 'LIVE');
  }, [state.stage]);

  // Helper to update specific parts of state
  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // 1. Handle User Idea Submission
  const handleIdeaSubmit = async (idea: string) => {
    SoundEngine.playMagic();
    updateState({ 
      stage: 'DESIGN', 
      userIdea: idea, 
      loading: true, 
      loadingMessage: "Dreaming up designs..." 
    });

    try {
      const options = await Gemini.generateDesignOptions(idea);
      SoundEngine.playMagic();
      updateState({ 
        designOptions: options, 
        loading: false 
      });
    } catch (error) {
      console.error(error);
      updateState({ loading: false, stage: 'IDLE' }); // Reset on fail
      alert("Oops! The idea factory is a bit jammed. Try again!");
    }
  };

  // 2. Handle Design Selection
  const handleDesignSelect = async (option: OptionItem) => {
    updateState({ 
      selectedDesign: option,
      stage: 'LOGIC',
      loading: true,
      loadingMessage: "Inventing game mechanics..."
    });

    try {
      const options = await Gemini.generateLogicOptions(state.userIdea, option.title);
      SoundEngine.playMagic();
      updateState({
        logicOptions: options,
        loading: false
      });
    } catch (error) {
      console.error(error);
      updateState({ loading: false });
    }
  };

  // 3. Handle Logic Selection -> Build
  const handleLogicSelect = async (option: OptionItem) => {
    if (!state.selectedDesign) return;

    updateState({
      selectedLogic: option,
      stage: 'BUILD',
      loading: true,
      loadingMessage: "Compiling your masterpiece..."
    });

    try {
      const code = await Gemini.generateAppCode(state.userIdea, state.selectedDesign, option);
      SoundEngine.playMagic();
      updateState({
        generatedCode: code,
        stage: 'LIVE',
        loading: false
      });
    } catch (error) {
      console.error(error);
      updateState({ loading: false });
    }
  };

  const restartApp = () => {
    SoundEngine.playClick();
    updateState({
      stage: 'IDLE',
      userIdea: '',
      selectedDesign: null,
      selectedLogic: null,
      generatedCode: null,
      designOptions: [],
      logicOptions: [],
      loading: false
    });
  };

  // Determine current tip for Jargon Translator
  const getCurrentTip = (): string | undefined => {
    if (state.stage === 'DESIGN' && !state.loading) return "Design is how your app looks. Good design makes apps easy to use!";
    if (state.stage === 'LOGIC' && !state.loading) return "Logic is how your app thinks. It decides what happens when you click!";
    if (state.stage === 'BUILD' || state.loading) return "Compiling means turning human words into robot code.";
    if (state.stage === 'LIVE') return "An 'iframe' is like a window that keeps this app safe from the rest of the page.";
    return undefined;
  };
  
  // Also pass specific tips from options if available
  const activeTip = 
    state.selectedLogic?.tip || 
    state.selectedDesign?.tip || 
    getCurrentTip();

  return (
    <div className="min-h-screen w-full flex flex-col relative" style={{ backgroundColor: COLORS.background }}>
      
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        
        {state.loading ? (
          <ComponentMixer message={state.loadingMessage} />
        ) : (
          <>
            {state.stage === 'IDLE' && (
              <HeroInput onSubmit={handleIdeaSubmit} />
            )}

            {state.stage === 'DESIGN' && (
              <OptionSelector 
                title="Pick a Style" 
                options={state.designOptions} 
                onSelect={handleDesignSelect} 
              />
            )}

            {state.stage === 'LOGIC' && (
              <OptionSelector 
                title="How do you play?" 
                options={state.logicOptions} 
                onSelect={handleLogicSelect} 
              />
            )}

            {state.stage === 'LIVE' && state.generatedCode && (
              <AppSandbox code={state.generatedCode} onRestart={restartApp} />
            )}
          </>
        )}
      </main>

      {/* Footer Copyright */}
      <footer className="w-full text-center py-4 text-gray-500 text-sm font-bold tracking-widest uppercase opacity-60 z-10 hover:opacity-100 transition-opacity">
        Done by Druv
      </footer>

      {/* Controllers */}
      <JargonTranslator currentTip={activeTip} />
      <AudioControl />
    </div>
  );
};

export default App;