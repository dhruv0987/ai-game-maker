import { GoogleGenAI, Type, Schema } from "@google/genai";
import { OptionItem } from "../types";

// Helper to get the AI instance safely
const getAI = () => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  // Assume this variable is pre-configured, valid, and accessible.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const modelFlash = 'gemini-3-flash-preview'; 

export const generateDesignOptions = async (idea: string): Promise<OptionItem[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tip: { type: Type.STRING, description: "A short educational fact about UI/UX design suitable for a child." },
      },
      required: ["id", "title", "description", "tip"],
    },
  };

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: `The user (a child) wants to build an app with this idea: "${idea}". 
      Suggest 3 distinct, creative visual themes/styles for this app. 
      Make the titles fun and catchy. 
      The tips should explain a design concept (like 'Contrast', 'Palette', 'Layout') simply.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a friendly expert mentor for kids learning to code.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as OptionItem[];
  } catch (error) {
    console.error("Design Gen Error:", error);
    // Fallback if AI fails or key is missing
    return [
      { id: '1', title: 'Neon Arcade', description: 'Bright glowing lights and dark backgrounds.', tip: 'High contrast makes things easy to see!' },
      { id: '2', title: 'Paper Sketch', description: 'Looks like it was drawn in a notebook.', tip: 'Hand-drawn styles feel friendly and personal.' },
      { id: '3', title: 'Future Glass', description: 'Shiny, transparent, and super clean.', tip: 'Minimalism helps users focus on the content.' },
    ];
  }
};

export const generateLogicOptions = async (idea: string, design: string): Promise<OptionItem[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tip: { type: Type.STRING, description: "A short educational fact about coding logic or game mechanics suitable for a child." },
      },
      required: ["id", "title", "description", "tip"],
    },
  };

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: `The user is building a "${design}" style app about "${idea}". 
      Suggest 3 distinct gameplay or interaction mechanics. 
      How does the user interact with the app? 
      Make it fun and varied (e.g., clicking, dragging, typing, timing).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a friendly expert mentor for kids learning to code.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as OptionItem[];
  } catch (error) {
    console.error("Logic Gen Error:", error);
    return [
      { id: '1', title: 'Tap Master', description: 'Tap fast to win!', tip: 'Event Listeners wait for your clicks.' },
      { id: '2', title: 'Drag & Drop', description: 'Move items around the screen.', tip: 'Coordinates tell the computer where things are.' },
      { id: '3', title: 'Type It', description: 'Use the keyboard to control things.', tip: 'Input fields collect text from the user.' },
    ];
  }
};

export const generateAppCode = async (idea: string, design: OptionItem, logic: OptionItem): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      Act as an expert web developer for kids.
      Create a SINGLE HTML file containing HTML, CSS, and JavaScript.
      
      APP REQUIREMENTS:
      - Concept: ${idea}
      - Visual Theme: ${design.title} (${design.description})
      - Mechanics: ${logic.title} (${logic.description})
      - Target Audience: Kids 6-12 years old.
      
      TECHNICAL CONSTRAINTS:
      - Use Tailwind CSS via CDN (already included in environment, but include the script tag in your output to be safe).
      - Use FontAwesome or similar via CDN if needed for icons.
      - NO external assets that require CORS or might break (images should be data URIs or placeholders like https://picsum.photos).
      - Make it visually impressive: animations, particles, bright colors.
      - Code must be robust and handle errors.
      - Ensure the app takes up the full window height/width.
      - IMPORTANT: Return ONLY raw HTML code. Do NOT wrap in markdown code blocks like \`\`\`html.
      
      EDUCATIONAL TWIST:
      - Add comments in the code explaining what complex parts do, as if teaching a kid.
    `;

    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class creative coder. Write clean, working, and impressive code.",
      }
    });

    let code = response.text || "";
    
    // Cleanup markdown if present (just in case)
    code = code.replace(/```html/g, '').replace(/```/g, '');
    
    return code;

  } catch (error) {
    console.error("Code Gen Error:", error);
    return `<html><body><h1 style="color:white; text-align:center;">Oh no! The code elves got confused. Try again!</h1><p style="text-align:center; color: #aaa;">(Check your API Key)</p></body></html>`;
  }
};