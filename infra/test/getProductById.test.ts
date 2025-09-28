import { handler } from "../lambda/handlers/getProductById";
import { APIGatewayProxyResult } from "aws-lambda";

describe("getProductById", () => {
  it("should return a product when ID exists", async () => {
    const event = { pathParameters: { id: "1" } };
    const result = await handler(event as any, {} as any, () => {}) as APIGatewayProxyResult;
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body.id).toBe("1");
  });

  it("should return 404 when product not found", async () => {
    const event = { pathParameters: { id: "999" } };
    const result = await handler(event as any, {} as any, () => {}) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(404);
  });
});
