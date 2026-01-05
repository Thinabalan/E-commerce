import { productService } from "../services/productService"
import type { Product, Category, SellProduct } from "../types/types";

export default function useProduct() {
  // Get all products
  const getProducts = async (): Promise<Product[]> => {
    try {
      return (await productService.getProducts()) || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  // Get all categories
  const getCategories = async (): Promise<Category[]> => {
    try {
      return (await productService.getCategories()) || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  // Add product
  const addProduct = async (productData: SellProduct): Promise<Product> => {
    try {
      return await productService.createProduct(productData);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  return {
    getProducts,
    getCategories,
    addProduct,
  };
}
