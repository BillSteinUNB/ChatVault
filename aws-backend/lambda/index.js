const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION || "us-east-1" });
const dynamo = new DynamoDBClient({ region: process.env.BEDROCK_REGION || "us-east-1" });

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const requestId = event.requestContext?.requestId || Math.random().toString(36).substring(7);
  const timestamp = Date.now();

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

    let completion = "";
    let provider = "";

    if (isDryRun) {
      completion = "This is a MOCK response from AWS Lambda. No Bedrock costs were incurred.";
      provider = "AWS (Mock)";
    } else {
      const modelId = process.env.MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";
      const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [{ role: "user", content: [{ type: "text", text: prompt }] }]
      };

      const command = new InvokeModelCommand({
        modelId: modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      });

      const response = await client.send(command);
      const decodedBody = JSON.parse(new TextDecoder().decode(response.body));
      completion = decodedBody.content[0].text;
      provider = "AWS Bedrock";
    }

    if (process.env.LOG_TABLE_NAME) {
      await dynamo.send(new PutItemCommand({
        TableName: process.env.LOG_TABLE_NAME,
        Item: {
          requestId: { S: requestId },
          timestamp: { N: timestamp.toString() },
          promptLength: { N: prompt.length.toString() },
          isDryRun: { BOOL: isDryRun }
        }
      })).catch(err => console.error("Dynamo Log Error:", err));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ completion, provider }),
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
