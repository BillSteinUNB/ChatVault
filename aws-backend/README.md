# AWS Backend Deployment Guide

This directory contains the AWS Infrastructure as Code (CDK) to deploy a serverless "Bedrock Bridge".
This allows your frontend to securely call Amazon Bedrock models (like Claude 3) without exposing AWS credentials.

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **Node.js**: Installed on your machine.
3.  **AWS CLI**: Installed and configured (`aws configure`).

## Setup

1.  **Install Dependencies**:
    ```bash
    cd aws-backend
    npm install
    ```

2.  **Bootstrap CDK** (Only needed once per region):
    ```bash
    npx cdk bootstrap
    ```

3.  **Deploy the Stack**:
    ```bash
    npx cdk deploy
    ```
    *   Confirm the deployment when asked.
    *   **Cost**: This deployment creates resources that are **Free Tier eligible** (Lambda, API Gateway) and idle cost is $0.

## Post-Deployment

1.  **Get the API URL**:
    After deployment, the terminal will output an `ApiUrl`. It looks like:
    `https://xyz123.execute-api.us-east-1.amazonaws.com/prod/`

2.  **Update Frontend**:
    Go to your `Web/.env` file and update:
    ```env
    VITE_AI_PROVIDER=AWS
    VITE_AWS_API_URL=https://xyz123... (your URL from step 1)
    VITE_AWS_DRY_RUN=true  <-- Set to false to actually bill credits
    ```

3.  **Enable Bedrock Models**:
    Ensure you have enabled "Anthropic Claude 3" in the AWS Console > Amazon Bedrock > Model access.

## Cost Safety

*   **Dry Run Mode**: By default, the frontend sends `dryRun: true`. The Lambda will return a mock response and **NOT** call Bedrock, ensuring $0 cost while testing connections.
*   **Lambda Timeout**: Set to 30 seconds to prevent hanging processes.
