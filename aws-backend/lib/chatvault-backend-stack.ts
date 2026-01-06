import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ChatVaultBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Create the Lambda Function (The "Brain")
    const bedrockLambda = new lambda.Function(this, 'BedrockProxyHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      timeout: Duration.seconds(30), // Allow time for LLM response
      environment: {
        BEDROCK_REGION: 'us-east-1', // Bedrock model availability varies by region
        MODEL_ID: 'anthropic.claude-3-sonnet-20240229-v1:0', // Claude 3 Sonnet
      },
    });

    // 2. Grant Permissions to Call Bedrock
    bedrockLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*'], // Ideally verify specific model ARN in production
    }));

    // 3. Create API Gateway (The "Door")
    const api = new apigateway.RestApi(this, 'ChatVaultApi', {
      restApiName: 'ChatVault Service',
      description: 'Proxies frontend requests to AWS Bedrock',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const integration = new apigateway.LambdaIntegration(bedrockLambda);
    api.root.addMethod('POST', integration);

    // 4. Output the URL
    new CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'The URL to call from your Frontend',
    });
  }
}
