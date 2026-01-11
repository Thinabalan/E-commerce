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
        const productData = { ...data, status: "active" };
        return apiService.post("products", productData);
    },

    // Update product status
    updateProductStatus: async (id: string | number, status: "active" | "inactive"): Promise<Product> => {
        return apiService.patch(`products/${id}`, { status });
    },

    // Update product
    updateProduct: async (id: string | number, data: SellProduct): Promise<Product> => {
        return apiService.patch(`products/${id}`, data);
    },

    // Delete product
    deleteProduct: async (id: string | number): Promise<void> => {
        return apiService.delete(`products/${id}`);
    },
};
