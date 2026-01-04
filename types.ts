export type AppStage = 'IDLE' | 'DESIGN' | 'LOGIC' | 'BUILD' | 'LIVE';

export interface OptionItem {
  id: string;
  title: string;
  description: string;
  tip: string; // The educational tip
}

export interface AppState {
  stage: AppStage;
  userIdea: string;
  selectedDesign: OptionItem | null;
  selectedLogic: OptionItem | null;
  generatedCode: string | null;
  designOptions: OptionItem[];
  logicOptions: OptionItem[];
  loading: boolean;
  loadingMessage: string;
}

export interface JargonTerm {
  term: string;
  definition: string;
}
