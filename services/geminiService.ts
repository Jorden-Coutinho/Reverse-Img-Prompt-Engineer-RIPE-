import { GoogleGenAI, Type } from "@google/genai";
import { VeoPromptData } from "../types";

const API_KEY = process.env.API_KEY;

// Initialize Gemini Client
// We use gemini-2.5-flash for a good balance of speed and multimodal capability
const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Reverse Prompt Engineer specializing in cinematic and high-quality video generation using Google Veo. 
Your task is to analyze an uploaded image or video clip and generate the most effective, detailed, and structured text prompt that a user would need to input into Veo to create that exact media content.

Analyze the visual data and break it down into the following categories:
1. CINEMATOGRAPHY: Shot type, camera angle, movement.
2. SUBJECT: Main character/focal point, attire, expression.
3. ACTION: Primary activity, movement (implied or actual).
4. CONTEXT & SETTING: Environment, background, time of day.
5. STYLE & AMBIANCE: Aesthetic, lighting, film grain, mood.
6. AUDIO: Soundscape, SFX, ambient noise.
7. NEGATIVE PROMPT: Elements to exclude (e.g., text, watermarks, blur).

Synthesize cinematic language using high-level, precise terminology (e.g., "rack focus," "anamorphic lens flare").
`;

export const analyzeMedia = async (base64Data: string, mimeType: string): Promise<VeoPromptData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this media and generate a structured Veo prompt following the cinematic guidelines.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cinematography: { type: Type.STRING, description: "Shot type, camera angle, and camera movement." },
            subject: { type: Type.STRING, description: "Main character details, attire, texture, expression." },
            action: { type: Type.STRING, description: "Primary activity and movement." },
            context_setting: { type: Type.STRING, description: "Environment, background elements, time of day." },
            style_ambiance: { type: Type.STRING, description: "Aesthetic, lighting, film grain, mood." },
            audio: { type: Type.STRING, description: "Soundscape, dialogue, or music suggestions." },
            negative_prompt: { type: Type.STRING, description: "Elements to explicitly exclude." },
          },
          required: ["cinematography", "subject", "action", "context_setting", "style_ambiance", "negative_prompt"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    return JSON.parse(text) as VeoPromptData;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
