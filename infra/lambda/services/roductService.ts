import { Product } from "../models/product";
import { products } from "../mock/products";

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return products.find((p) => p.id === id);
  }
}
