#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { FargateServiceWithAutoScalingStack } from '../lib/fargate-service-with-auto-scaling-stack';

const app = new cdk.App();
new FargateServiceWithAutoScalingStack(app, 'FargateServiceWithAutoScalingStack');
