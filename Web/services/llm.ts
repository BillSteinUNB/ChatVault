// Web/services/llm.ts

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const AWS_API_URL = import.meta.env.VITE_AWS_API_URL;
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'GEMINI'; // 'GEMINI' or 'AWS'

export interface AIResponse {
  text: string;
  provider: string;
}

export async function generateText(prompt: string): Promise<AIResponse> {
  if (AI_PROVIDER === 'AWS') {
    return callAwsBedrock(prompt);
  } else {
    return callGemini(prompt);
  }
}

async function callAwsBedrock(prompt: string): Promise<AIResponse> {
  if (!AWS_API_URL) {
    throw new Error("AWS_API_URL is not set");
  }

  // Determine if we should mock the call to save costs
  const isDryRun = import.meta.env.VITE_AWS_DRY_RUN === 'true';

  const response = await fetch(AWS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      dryRun: isDryRun 
    }),
  });

  if (!response.ok) {
    throw new Error(`AWS Bedrock Error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.completion,
    provider: data.provider
  };
}

async function callGemini(prompt: string): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  // Simple Gemini API call (conceptual - matches your existing logic)
  // Replacing your direct calls with this function would centralize the logic
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating response";
  
  return {
    text,
    provider: "Google Gemini"
  };
}
