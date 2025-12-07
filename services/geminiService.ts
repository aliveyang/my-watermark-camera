import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { WatermarkData } from "../types";

// Helper to get API key safely in both Vite and standard envs
const getApiKey = () => {
  // @ts-ignore - Vite injects import.meta.env at build time
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return undefined;
};

export const analyzeImageContext = async (
  base64Image: string,
  currentData: WatermarkData
): Promise<Partial<WatermarkData>> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key is missing");
    return {};
  }

  const ai = new GoogleGenerativeAI(apiKey);

  try {
    // Remove header if present (e.g. data:image/png;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            weather: { type: SchemaType.STRING },
            location: { type: SchemaType.STRING },
          },
          required: ["weather", "location"],
        },
      },
    });

    const response = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      },
      `Analyze this image for a work record watermark.
      1. Estimate the weather condition and temperature (e.g., "Sunny 25°C", "Cloudy 18°C") based on visual cues.
      2. Describe the location or scene type concisely (e.g., "Construction Site, Sector A", "City Park Maintenance").

      Return JSON.`,
    ]);

    const result = JSON.parse(response.response.text() || "{}");

    // Update items based on heuristic matching of labels
    const updatedItems = currentData.items.map((item) => {
      // Check for weather-related labels (Chinese "天 气" or English "Weather")
      if (
        result.weather && 
        (item.label.includes("气") || item.label.toLowerCase().includes("weather"))
      ) {
        return { ...item, value: result.weather };
      }
      
      // Check for location-related labels (Chinese "地 点" or English "Location")
      if (
        result.location && 
        (item.label.includes("点") || item.label.toLowerCase().includes("location"))
      ) {
        return { ...item, value: result.location };
      }

      return item;
    });

    return {
      items: updatedItems,
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};