import { formatJSONResponse } from "../utils/response";
import { ProductService } from "../services/roductService";
import { APIGatewayProxyHandler } from "aws-lambda";

const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return formatJSONResponse(400, { message: "Product ID is required" });
    }

    const product = await productService.getProductById(id);
    if (!product) {
      return formatJSONResponse(404, { message: "Product not found" });
    }

    return formatJSONResponse(200, product);
  } catch (error) {
    return formatJSONResponse(500, { message: "Internal Server Error" });
  }
};
