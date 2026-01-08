import { Stack, StackProps, Duration, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class ChatVaultBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logTable = new dynamodb.Table(this, 'RequestLogs', {
      partitionKey: { name: 'requestId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const exportBucket = new s3.Bucket(this, 'UserExports', {
      versioned: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const bedrockLambda = new lambda.Function(this, 'BedrockProxyHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      timeout: Duration.seconds(30),
      environment: {
        BEDROCK_REGION: 'us-east-1',
        MODEL_ID: 'anthropic.claude-3-sonnet-20240229-v1:0',
        LOG_TABLE_NAME: logTable.tableName,
        EXPORT_BUCKET_NAME: exportBucket.bucketName,
      },
    });

    bedrockLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*'],
    }));

    logTable.grantReadWriteData(bedrockLambda);
    exportBucket.grantReadWrite(bedrockLambda);

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

    new CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'The URL to call from your Frontend',
    });
  }
}
