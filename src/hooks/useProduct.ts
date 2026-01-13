import { useCallback } from "react";
import { productService } from "../services/productService"
import type { Product, Category, SellProduct, DraftProduct } from "../types/types";

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

  /* TOGGLE STATUS (Soft Delete / Reactivate) */
  const toggleProductStatus = useCallback(async (id: string | number, currentStatus: "active" | "inactive") => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      return await productService.updateProductStatus(id, newStatus);
    } catch (error) {
      console.error("Error toggling product status:", error);
      throw error;
    }
  }, []);

  /* DRAFTS (API) */
  const getDrafts = useCallback(async (): Promise<Product[]> => {
    try {
      return await productService.getDrafts();
    } catch (error) {
      console.error("Error fetching drafts:", error);
      return [];
    }
  }, []);

  const saveDraft = useCallback(async (draft: DraftProduct) => {
    try {
      const now = new Date().toISOString();
      const draftData = {
        ...draft,
        status: "draft" as const,
        updatedAt: now,
      };

      if (draft.id) {
        // UPDATE
        return await productService.updateDraft(draft.id, draftData);
      }

      // CREATE
      return await productService.createDraft(draftData);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }, []);


  const deleteDraft = useCallback(async (id: string | number) => {
    try {
      await productService.deleteDraft(id);
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  }, []);

  return {
    getProducts,
    getCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getDrafts,
    saveDraft,
    deleteDraft
  };
}
