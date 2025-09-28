import { APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse } from "../utils/response";
import { ProductService } from "../services/roductService";

const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const products = await productService.getAllProducts();
    return formatJSONResponse(200, products);
  } catch (error) {
    return formatJSONResponse(500, { message: "Internal Server Error" });
  }
};
