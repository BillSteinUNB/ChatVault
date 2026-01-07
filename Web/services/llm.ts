// Web/services/llm.ts

const AWS_API_URL = import.meta.env.VITE_AWS_API_URL;
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'AWS'; // 'AWS' only (Gemini removed for security)

export interface AIResponse {
  text: string;
  provider: string;
}

export async function generateText(prompt: string): Promise<AIResponse> {
  // Always use AWS Bedrock (security requirement: no client-side API keys)
  return callAwsBedrock(prompt);
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
