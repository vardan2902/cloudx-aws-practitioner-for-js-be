import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from "node:path";
import { LambdaConfig, LambdaConstruct } from "./lambda-construct";
import { RestApiGatewayConstruct } from "./rest-api-gateway-construct";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaConfigs: LambdaConfig[] = [
      {
        name: 'GetProductList',
        entry: path.join(__dirname, '../resources/build/getProductList.js'),
        method: 'GET',
        swaggerFile: path.join(__dirname, '../lambda/swagger/getProductList.json'),
      },
      {
        name: 'getProductById',
        entry: path.join(__dirname, '../resources/build/getProductById.js'),
        method: 'GET',
        swaggerFile: path.join(__dirname, '../lambda/swagger/getProductById.json'),
      },
    ];

    const lambdaInstances = lambdaConfigs.map(config => {
      const construct = new LambdaConstruct(this, `${config.name}Construct`, config);
      return { name: config.name, fn: construct.fn, method: config.method, swaggerFile: config.swaggerFile };
    });

    new RestApiGatewayConstruct(this, 'RestApiGatewayConstruct', {
      name: 'RestApi',
      lambdas: lambdaInstances,
      generalSwaggerFile: path.join(__dirname, '../lambda/swagger/swagger.json'),
    });
  }
}
