import { apiService } from "./apiService";
import type { Product, Category, SellProduct } from "../types/types";

export const productService = {
    // Get all products
    getProducts: async (): Promise<Product[]> => {
        return apiService.get("products");
    },

    // Get all categories
    getCategories: async (): Promise<Category[]> => {
        return apiService.get("categories");
    },

    // Create product
    createProduct: async (data: SellProduct): Promise<Product> => {
        return apiService.post("products", data);
    },
};
