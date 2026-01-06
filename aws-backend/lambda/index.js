const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION || "us-east-1" });

exports.handler = async (event) => {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body);
    const prompt = body.prompt;
    const isDryRun = body.dryRun === true;

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    // --- DRY RUN MODE (Safe for Testing) ---
    if (isDryRun) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          completion: "This is a MOCK response from AWS Lambda. No Bedrock costs were incurred.",
          provider: "AWS (Mock)",
        }),
      };
    }

    // --- REAL BEDROCK CALL ---
    const modelId = process.env.MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";

    // Format payload for Claude 3
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            }
          ]
        }
      ]
    };

    const command = new InvokeModelCommand({
      modelId: modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const decodedBody = JSON.parse(new TextDecoder().decode(response.body));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        completion: decodedBody.content[0].text,
        provider: "AWS Bedrock",
      }),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
};
