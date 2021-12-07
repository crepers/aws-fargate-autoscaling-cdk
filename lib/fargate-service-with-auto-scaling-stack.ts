import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import ecr = require('@aws-cdk/aws-ecr');

export class FargateServiceWithAutoScalingStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a cluster
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'fargate-service-autoscaling', { vpc });

    // Container image
    const repository = new ecr.Repository(this, 'demo-springboot-api', {
      repositoryName: 'demo-springboot-api',
    });

    // Create Fargate Servicecdk
    // ApplicationLoadBalancedFargateService
    // const fargateService = new ecs_patterns.NetworkLoadBalancedFargateService(this, 'sample-app', {
    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'sample-app', {
      cluster,
      // desiredCount: 1,
      cpu: 256,
      memoryLimitMiB: 512,
      
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository, "v1"),
        containerPort: 8080,
      },
    });

    fargateService.targetGroup.configureHealthCheck({
      healthyHttpCodes: "200,301,302",
      path: '/',
      port: '8080'
      });
    // //customize healthcheck on ALB
    // fargateService.targetGroup.configureHealthCheck({
    //   "port": 'traffic-port',
    //   "path": '/',
    //   "interval": cdk.Duration.seconds(10),
    //   "timeout": cdk.Duration.seconds(4),
    //   "healthyThresholdCount": 2,
    //   "unhealthyThresholdCount": 2,
    //   "healthyHttpCodes": "200,301,302"
    // })

    // Setup AutoScaling policy
    const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: 2 });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(180),
      scaleOutCooldown: cdk.Duration.seconds(180)
    });

    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.loadBalancerDnsName });
  }
}
