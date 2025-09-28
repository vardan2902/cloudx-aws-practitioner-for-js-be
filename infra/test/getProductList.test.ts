import { handler } from "../lambda/handlers/getProductList";
import { APIGatewayProxyResult } from "aws-lambda";

describe("getProductsList", () => {
  it("should return a list of products", async () => {
    const result = await handler({} as any, {} as any, () => {}) as APIGatewayProxyResult;
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});
