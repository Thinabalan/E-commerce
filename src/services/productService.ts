import { apiService } from "./apiService";
import type { Product, Category, CreateProduct } from "../types/ProductTypes";

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
    createProduct: async (data: CreateProduct): Promise<Product> => {
        return apiService.post("products", {
            ...data,
            status: data.status || "active",
        });
    },

    // Update product status
    updateProductStatus: async (id: string | number, status: "active" | "inactive"): Promise<Product> => {
        return apiService.patch(`products/${id}`, { status });
    },

    // Update product
    updateProduct: async (id: string | number, data: Partial<Product>): Promise<Product> => {
        return apiService.patch(`products/${id}`, data);
    },

    // Delete product
    deleteProduct: async (id: string | number): Promise<void> => {
        return apiService.delete(`products/${id}`);
    },
};
