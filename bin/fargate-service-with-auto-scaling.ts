#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FargateServiceWithAutoScalingStack } from '../lib/fargate-service-with-auto-scaling-stack';

const app = new cdk.App();
new FargateServiceWithAutoScalingStack(app, 'FargateServiceWithAutoScalingStack');
