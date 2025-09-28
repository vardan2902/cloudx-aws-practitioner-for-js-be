import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as fs from "node:fs";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";

interface ApiGatewayProps {
  name: string;
  lambdas: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    name: string;
    fn: lambda.IFunction,
    swaggerFile: string;
  }[];
  generalSwaggerFile: string;
}

export class RestApiGatewayConstruct extends Construct {
  public readonly api: apigateway.SpecRestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayProps) {
    super(scope, id);

    const generalSwagger = JSON.parse(fs.readFileSync(props.generalSwaggerFile, 'utf-8'));

    const paths: Record<string, any> = {};
    for (const l of props.lambdas) {
      l.fn.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

      const lambdaSpec = JSON.parse(fs.readFileSync(l.swaggerFile, 'utf-8'));

      for (const [p, methods] of Object.entries(lambdaSpec.paths)) {
        const fixedMethods: Record<string, any> = {};
        for (const [m, details] of Object.entries(methods as any)) {
          fixedMethods[m.toLowerCase()] = {
            ...(details as object ?? {}),
            'x-amazon-apigateway-integration': {
              type: 'aws_proxy',
              httpMethod: 'POST',
              uri: `arn:aws:apigateway:${Stack.of(this).region}:lambda:path/2015-03-31/functions/${l.fn.functionArn}/invocations`,
              passthroughBehavior: 'WHEN_NO_MATCH',
            }
          }
        }
        paths[p] = fixedMethods;
      }
    }

    const fullSpec = {
      ...generalSwagger,
      paths,
    };

    this.api = new apigateway.SpecRestApi(this, `${props.name}Gateway`, {
      apiDefinition: apigateway.ApiDefinition.fromInline(fullSpec),
      deployOptions: { stageName: 'prod' },
    });

    const baseUrl = this.api.url.replace(/\/$/, '');
    const endpoints: string[] = [];

    for (const [p, methods] of Object.entries(paths)) {
      const normalizedPath = p.startsWith('/') ? p : `/${p}`;
      for (const m of Object.keys(methods)) {
        endpoints.push(`${m.toUpperCase()} ${baseUrl}${normalizedPath}`);
      }
    }

    new CfnOutput(this, 'ApiEndpoints', {
      value: endpoints.join('\n'),
      description: 'All API endpoints',
    });
  }
}
