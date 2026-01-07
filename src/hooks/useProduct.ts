import { useCallback } from "react";
import { productService } from "../services/productService"
import type { Product, Category, SellProduct } from "../types/types";

export default function useProduct() {
  // Get all products
  const getProducts = useCallback(async (): Promise<Product[]> => {
    try {
      return (await productService.getProducts()) || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }, []);

  // Get all categories
  const getCategories = useCallback(async (): Promise<Category[]> => {
    try {
      return (await productService.getCategories()) || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }, []);

  // Add product
  const addProduct = useCallback(async (productData: SellProduct): Promise<Product> => {
    try {
      return await productService.createProduct(productData);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }, []);

  /* UPDATE */
  const updateProduct = useCallback(async (id: string | number, productData: SellProduct) => {
    try {
      return await productService.updateProduct(id, productData);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }, []);

  /* DELETE */
  const deleteProduct = useCallback(async (id: string | number) => {
    try {
      return await productService.deleteProduct(id);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }, []);

  return {
    getProducts,
    getCategories,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
