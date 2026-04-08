/**
 * GeminiService.ts
 * 
 * A secure service layer for interacting with Google's Gemini AI.
 * It automatically handles the switch between 'Live AI' and 'Simulation' mode
 * based on the presence of the VITE_GOOGLE_API_KEY environment variable.
 */

import { getGeminiModel } from '../firebase';

export interface AIResponse {
  content: string;
  sentiment: 'neutral' | 'positive' | 'frustrated';
  engagementScore: number;
  isSimulated: boolean;
}

const IS_SIMULATED = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here';

const MOCK_SUGGESTIONS = [
  "It seems they hesitated when mentioned 'Pricing'. Ask: 'What specifically about the pricing feels unclear?'",
  "Positive signal detected on the 'Clean UI'. Ask: 'Compared to your current tool, what feels simplified here?'",
  "Frustration spike during address search. Ask: 'Did you expect a direct input field rather than a dropdown?'"
];

const MOCK_SENTIMENTS: ('neutral' | 'positive' | 'frustrated')[] = ['neutral', 'positive', 'frustrated'];

/**
 * Gets a real-time recommendation and sentiment analysis.
 * In a real implementation, this would call the Gemini API.
 */
export const getSessionAnalysis = async (transcriptSnippet: string): Promise<AIResponse> => {
  if (IS_SIMULATED) {
    // Delay to simulate network latency and use the snippet
    console.log("Simulating analysis for:", transcriptSnippet.substring(0, 30) + "...");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      content: MOCK_SUGGESTIONS[Math.floor(Math.random() * MOCK_SUGGESTIONS.length)],
      sentiment: MOCK_SENTIMENTS[Math.floor(Math.random() * MOCK_SENTIMENTS.length)],
      engagementScore: Math.floor(Math.random() * (98 - 85 + 1)) + 85,
      isSimulated: true,
    };
  }

  try {
    const model = getGeminiModel();
    const prompt = `Analyze this user research snippet: "${transcriptSnippet}". 
    Provide:
    1. A single high-impact follow-up question.
    2. Sentiment (positive, frustrated, or neutral).
    3. Engagement score (0-100).
    Format as JSON: { "question": "...", "sentiment": "...", "score": 85 }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    // Softening JSON parse as Gemini might wrap in markdown
    const jsonStr = responseText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return {
      content: data.question || data.content,
      sentiment: data.sentiment || 'neutral',
      engagementScore: data.score || 85,
      isSimulated: false
    };
  } catch (error) {
    console.warn("Firebase Gemini Error:", error);
    return {
      content: "Connected to Firebase, but encountered an error generating recommendations. Falling back to simulation.",
      sentiment: 'neutral',
      engagementScore: 50,
      isSimulated: true
    };
  }
};

/**
 * Helper to check connection status
 */
export const getConnectionStatus = () => {
  return {
    isConnected: !IS_SIMULATED,
    mode: IS_SIMULATED ? 'Demo Mode (Simulated)' : 'Live AI Mode (Vertex AI for Firebase: Gemini 1.5 Flash)',
    labelColor: IS_SIMULATED ? 'text-amber-500' : 'text-emerald-500',
    dotColor: IS_SIMULATED ? 'bg-amber-500' : 'bg-emerald-500',
  };
};
