import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export interface LambdaConfig {
  name: string;
  entry: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  swaggerFile: string;
}

export class LambdaConstruct extends Construct {
  public readonly fn: NodejsFunction;

  constructor(scope: Construct, id: string, config: LambdaConfig) {
    super(scope, id);

    this.fn = new NodejsFunction(this, `${config.name}Lambda`, {
      runtime: Runtime.NODEJS_22_X,
      entry: config.entry,
      handler: 'handler',
    });
  }
}
