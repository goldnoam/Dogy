
import { GoogleGenAI } from "@google/genai";

export const askAboutUnity = async (): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return "API key is not configured. Please set the API_KEY environment variable to get an answer.";
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `A user created a concept for a 2D platformer game and asked if it could be made in Unity. 
        The game is about a fluffy dog fighting zombie dogs. 
        Please provide a concise, encouraging, and informative answer for a beginner, explaining why Unity is a good choice for this type of game. 
        Mention key features like the 2D tools, physics engine, asset store, and cross-platform capabilities.
        Keep it to one or two paragraphs.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        return "Sorry, I couldn't get an answer about Unity right now. It is, however, an excellent choice for building games like this!";
    }
};
