import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedScenario, ViolationType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scenarioSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    driverName: { type: Type.STRING },
    driverDialogue: { type: Type.STRING, description: "Uma desculpa curta, engraçada ou mal-humorada do motorista sobre o motivo da parada. Em Português. Máximo 15 palavras." },
    vehicleModel: { type: Type.STRING },
    vehicleColor: { type: Type.STRING },
    plateNumber: { type: Type.STRING },
    licenseExpiry: { type: Type.STRING, description: "Formato YYYY-MM-DD. Hoje é 1986-09-24." },
    isStolen: { type: Type.BOOLEAN },
    brokenLight: { type: Type.BOOLEAN },
    wornTires: { type: Type.BOOLEAN },
    hasInsurance: { type: Type.BOOLEAN },
    actualViolation: { 
      type: Type.STRING, 
      enum: Object.values(ViolationType),
      description: "A violação primária encontrada. Use NONE se o motorista estiver limpo." 
    },
  },
  required: ["driverName", "driverDialogue", "vehicleModel", "vehicleColor", "plateNumber", "licenseExpiry", "isStolen", "brokenLight", "wornTires", "hasInsurance", "actualViolation"],
};

export const generateTrafficStop = async (): Promise<GeneratedScenario> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Gere um cenário de parada de trânsito para um jogo policial retrô dos anos 80. A data atual do jogo é 24 de Setembro de 1986.",
      config: {
        responseMimeType: "application/json",
        responseSchema: scenarioSchema,
        systemInstruction: "Você é um motor de jogo para uma simulação policial. Gere dados realistas, mas com um toque de humor. Responda tudo em PORTUGUÊS DO BRASIL. Garanta uma mistura de motoristas inocentes e culpados (cerca de 40% de chance de violação).",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedScenario;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini generation error:", error);
    // Fallback data in case of error to keep game running
    return {
      driverName: "João da Silva",
      driverDialogue: "O sistema caiu, seu guarda! Me deixa ir?",
      vehicleModel: "Sedan",
      vehicleColor: "Blue",
      plateNumber: "ABC-1234",
      licenseExpiry: "1988-01-01",
      isStolen: false,
      brokenLight: false,
      wornTires: false,
      hasInsurance: true,
      actualViolation: ViolationType.NONE
    };
  }
};