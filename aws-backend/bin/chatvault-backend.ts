#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ChatVaultBackendStack } from '../lib/chatvault-backend-stack';

const app = new cdk.App();
new ChatVaultBackendStack(app, 'ChatVaultBackendStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
